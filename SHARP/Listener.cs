﻿using System;
using System.Collections.Generic;
using System.Linq;
using WASD.WASD.API;
using System.Text;
using WASD.WASD.ComponentModel;
using WASD.WASD.Runtime.NH.Listeners;
using NHibernate.Event;
using WASD.WASD.Tasks.Models;
using WASD.WASD.Common.Models;
using WASD.WASD.Logging;
using WASD.WASD.Model.Common;
using WASD.WASD.Model.Managers;
using WASD.WASD.ConfigurationModel;
using WASD.WASD.Security.Models;
using WASD.WASD.Projects.Models;

namespace GlobalModuleWASD
{
    [Component]
    public class Listener : PostFlushEventListener
    {
        public override void OnPostUpdateCollection(PostCollectionUpdateEvent @event)
        {
            var collection = @event.Collection;
            var collectionEntry = @event.Session.PersistenceContext.GetCollectionEntry(@event.Collection);
            var collectionEntries = collection.Entries(collectionEntry.LoadedPersister);
            
            List<Attachment> attachmentsList = new List<Attachment>();
            foreach (var entry in collectionEntries)
			{
				if (entry is IAttachment)
				{
					var attach = entry as Attachment;
					attachmentsList.Add(attach);
            	}
			}
			
            if (attachmentsList != null || attachmentsList.Count() > 0)
            {
            	var attachEntry = attachmentsList.LastOrDefault();
            	if (attachEntry != null)
            	{
            		Filter filterQ = new Filter();
		            filterQ.Query = string.Format("Attachments in (Id = {0})", attachEntry.Id);
		            var findEntity = EntityManager<ITaskBase>.Instance.Find(filterQ, null).FirstOrDefault();
		            TaskBase taskAttach = (TaskBase)findEntity;
		            
		            taskAttach.GeneralAttach.Clear();
		            foreach (var item in attachmentsList)
		            {
		            	PublicAPI.Services.Security.RunBySystemUser(() =>
		                        {
									var attachm = item as Attachment;
		                            Attachments new_attach = new Attachments();
		                            new_attach.CreationDate = (DateTime)attachm.CreationDate;
		                            new_attach.CreationAuthor = attachm.CreationAuthor;
									new_attach.File = attachm.File;
									new_attach.Name = attachm.File.Name;
									new_attach.IsAttachments = true;
		                           	new_attach.Save();
		                            taskAttach.GeneralAttach.Add(new_attach);
		                        });
		            }
            	}
            }

			foreach (var entry in collectionEntries)
            {
                // Обработка списка измененных комментариев
                if (entry is IComment)
                {
                    Filter filter = new Filter();
                    filter.Query = string.Format("Comments in (Id = {0})", (entry as IComment).Id);
                    var listKA = EntityManager<ITaskBase>.Instance.Find(filter, null);

                    if (listKA.Count > 0)
                    {
                        TaskBase task = (TaskBase)listKA.FirstOrDefault();
                        var tid = task.Id.ToString();
                        var comm = task.Comments.LastOrDefault();
                        Logger.Log.Error("Comment: Id: " + tid + " // Comment: " + comm.Text);

                        PublicAPI.Services.Security.RunBySystemUser(() =>
                        {

                            Comments new_comm = new Comments();
                            new_comm.CreationDate = (DateTime)comm.CreationDate;
                            new_comm.CreationAuthor = comm.CreationAuthor;

                            User user = comm.CreationAuthor;
                            string userStr = "";
                            if (!string.IsNullOrWhiteSpace(user.LastName) && !string.IsNullOrWhiteSpace(user.FirstName) && !string.IsNullOrWhiteSpace(user.MiddleName))
                            {
                                userStr = user.LastName + " " + user.FirstName[0] + "." + user.MiddleName[0] + ".";
                            }
                            else if (!string.IsNullOrWhiteSpace(user.LastName) && !string.IsNullOrWhiteSpace(user.FirstName))
                            {
                                userStr = user.LastName + " " + user.FirstName[0] + ".";
                            }

                            new_comm.Text = String.Format("{0} - {1}: {2}", comm.CreationDate.Value.ToString(), userStr, comm.Text); //    comm.Text;
							new_comm.IsComments = true;
                            new_comm.Save();
                            task.GeneralComment.Add(new_comm);

                        });
                        break;
                    }
                }
            }
        }

        public override void OnPostInsert(PostInsertEvent @event)
        {
            var rplscmnt = @event.Entity as IReplacement;
            if (rplscmnt is IReplacement)
            {
                var rplscmnt2 = (Replacement)rplscmnt;
                if (rplscmnt2.ReAssignActiveTasks == true)
                {
                    var startableProcess = PublicAPI.Processes.ProcessHeader.LoadOrNull(11010L);
                    var stringName = string.Format("Замещение {0}, {1}", rplscmnt2.SourceUser.FullName, rplscmnt2.Id.ToString());
                    
                    if (startableProcess != null)
                    {
                        //Logger.Log.Error("startableProcess != null");
                        var StartDate = (DateTime?)(rplscmnt2.StartDate);
                        var EndDate = (DateTime?)(rplscmnt2.EndDate);

                        Action<dynamic> processContext = myContext =>
                        {
                            myContext.Iniciator = rplscmnt2.TasksDistributer;
                            myContext.Replaceable = rplscmnt2.SourceUser;  
                            myContext.Replacing = rplscmnt2.TargetUser;
                            myContext.StartDate = StartDate;
                            myContext.EndDate = EndDate;
                            myContext.IsReassingTasks = rplscmnt2.ReAssignActiveTasks;
                            myContext.IsAccessReadView = rplscmnt2.TaskDocumentsPermissions;
                            myContext.IsGiveDocumentsRights = rplscmnt2.TaskDocumentsManagePermissions;
							myContext.IdReplacement = rplscmnt2.Id;
                        };
                        //Logger.Log.Error("myContext is OK ");
                        var instance = PublicAPI.Processes.WorkflowInstance.StartProcess(startableProcess.Published, stringName, processContext);
                        Logger.Log.Error("ReplacementStatus.Active");
                    }
                }

                //Logger.Log.Error("proccess is OK");
            }
        }
        
        public override void OnPostUpdate(PostUpdateEvent @event)
		{   
		     if(@event.Entity is IReplacement)
		     {
		     	var rplscmnt = @event.Entity as Replacement;	
		     	if (rplscmnt.Status == ReplacementStatus.Delete)
                {
                    var startableProcess = PublicAPI.Processes.ProcessHeader.LoadOrNull(11111L);
                    var stringName = string.Format("Завершение замещения {0}", rplscmnt.SourceUser.FullName);

                    if (startableProcess != null)
                    {
                        var StartDate = (DateTime?)(rplscmnt.StartDate);
                        var EndDate = (DateTime?)(rplscmnt.EndDate);

                        Action<dynamic> processContext = myContext =>
                        {
                            myContext.Iniciator = rplscmnt.TasksDistributer;
                            myContext.Replaceable = rplscmnt.SourceUser;  
                            myContext.Replacing = rplscmnt.TargetUser;
                            myContext.StartDate = StartDate;
                            myContext.EndDate = EndDate;
                            myContext.IsReassingTasks = rplscmnt.ReAssignActiveTasks;
                            myContext.IsAccessReadView = rplscmnt.TaskDocumentsPermissions;
                            myContext.IsGiveDocumentsRights = rplscmnt.TaskDocumentsManagePermissions;
							myContext.IdReplacement = rplscmnt.Id;
                        };

                        //Logger.Log.Error("myContext is OK ");
                        var instance = PublicAPI.Processes.WorkflowInstance.StartProcess(startableProcess.Published, stringName, processContext);
                        Logger.Log.Error("ReplacementStatus.Delete");
                    }
                }

                
            }
		 }
		 
    }

    [Component]
    public class Listener2 : EntityEventsListener
    {
        public override void OnPostInsert(PostInsertEvent @event)
        {
            if (@event.Entity is ITask)
            {
                Logger.Log.Error("@event.Entity is ITask");
                var task = @event.Entity as Task;
                if (task.WASD_Requirement != null)
                {
                    Logger.Log.Error("task.WASD_Requirement != null");
                    var cr = PublicAPI.Objects.UserObjects.UserWASD_ContractRequirement.LoadOrNull(task.WASD_Requirement.Id);
                    if (cr != null)
                    {
                        Logger.Log.Error("cr != null ");
                        cr.Tasks.Add(task);
                    }
                }
            }
        }
    }
}


