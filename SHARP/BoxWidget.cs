using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using [Deleted];
using [Deleted];
using [Deleted];
using [Deleted];
using [Deleted];
using [Deleted];
using [Deleted];
using [Deleted];
using [Deleted];
using [Deleted];
using [Deleted];
using [Deleted];
using [Deleted];
using [Deleted];
using System.Web.Mvc;
using [Deleted];
using [Deleted];
using System.Data.SqlClient;
using [Deleted];
using [Deleted];
using [Deleted];



namespace [Deleted].Portlets
{
    /// <summary>
    /// Контроллер портлета "Tasks Debug"
    /// </summary>
    public partial class TasksDebugController : PortletController<TasksDebug.Content, TasksDebug.Personalization, TasksDebug.Settings>
    {
        ITransformationProvider transformProv = Locator.GetServiceNotNull<ITransformationProvider>();

        private string errorstrTwo = "";
        private HtmlString executorTEMP;
        private DateTime? DueDate_temp;


        public virtual void Catcher(SqlConnection connection, SqlException ex)
        {
            StringBuilder errorMessages = new StringBuilder();
            for (int i = 0; i < ex.Errors.Count; i++)
            {
                errorMessages.Append("Index #" + i + "\n" + "Message: " + ex.Errors[i].Message + "\n" + "LineNumber: " + ex.Errors[i].LineNumber + "\n" + "Source: " + ex.Errors[i].Source + "\n" + "Procedure: " + ex.Errors[i].Procedure + "\n");
            }
            errorstrTwo += errorMessages;
            Console.WriteLine(errorMessages.ToString());
            connection.Close();
        }

        private class FakeController : Controller
        {
            [HttpGet]
            public ActionResult Action()
            {
                return new EmptyResult();
            }
        }

        public class BufferClass
        {
            public string taskId;

            public string bmid;

            public string executor;

            public string status;

            public string instanceId;

            public string elementUid;

            public string docId;

            public long? appointUser;

            public string task_typeuid;
        }

        public override void Content_Load(PortletContentLoadViewModel<TasksDebug.Content, TasksDebug.Personalization> portlet)
        {
            PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => Content_Load1(portlet));
            ClaimTask_GetLinks(portlet);
        }

        /// <summary>
        /// Подготовка данных для Claim task в блоке
        /// </summary>
        /// <param name="portlet">Модель портлета</param>
        public void ClaimTask_GetLinks(PortletContentLoadViewModel<TasksDebug.Content, TasksDebug.Personalization> portlet)
        {
            string jsclick = "<a href='\' onClick='javascript: function(){ $('#Context_ClaimPopUpTaskId')[0].value='{0}'; dynamicFormsOnChange($('#Context_Button-2713f938-e216-4ca5-88f1-4e16dbb162b2'), null, 'ClaimTask_GetTaskInfo', $('#Context_Button-2713f938-e216-4ca5-88f1-4e16dbb162b2').closest('form'),  [Deleted]_ClaimTaskPopUp);}' >Claim task</a>";
            foreach (var line in portlet.Context.GroupTasks)
            {
                if (line.TaskStr != null)
                {
                    line.TaskId = line.TaskId;
                }
                line.Action = new HtmlString("<a href='#' onClick=\"javascript: [Deleted]_StartClaim('" + line.TaskId.ToString() + "')\">Claim task</a>");
                line.Save();
            }
        }

        /// <summary>
        /// Получение информации для поп-ап окна Claim Task
        /// </summary>
        /// <param name="portlet">Модель портлета</param>
        public virtual void ClaimTask_GetTaskInfo(PortletContentViewModel<TasksDebug.Content, TasksDebug.Personalization> portlet)
        {
            portlet.Context.ClaimPopUpText = "no info";
            string popuptext = "<table style=\"width: 250px;\" border=\"0\" cellspacing=\"5px\" cellpadding=\"5px\"><tbody><tr><td style=\"text-align: left;\"><strong>Task:</strong></td><td style=\"text-align: left;\">{4}</td></tr><tr><td style=\"text-align: left;\"><strong>Document:</strong></td><td style=\"text-align: left;\">{0}</td></tr><tr><td style=\"text-align: left;\"><strong>From:</strong></td><td style=\"text-align: left;\">{1}</td></tr><tr><td style=\"text-align: left;\"><strong>Assigned to:</strong></td><td style=\"text-align: left;\">{2}</td></tr><tr><td style=\"text-align: left;\"><strong>Due by:</strong></td><td style=\"text-align: left;\">{3}</td></tr></tbody></table>";
            string cantclaimtext = "<p>&nbsp;</p><p><strong><em><span style=\"font-size: 10pt;\">This task is already claimed by {0}!</span></em></strong></p>";
            string canclaimtext = "<p>&nbsp;</p><p><strong><em><span style=\"font-size: 10pt;\">This is the group task and you can claim it.</span></em></strong></p>";
            if (!String.IsNullOrWhiteSpace(portlet.Context.ClaimPopUpTaskId))
            {
                Logger.Log.Error("CllkInfo #1");
                var line = portlet.Context.GroupTasks.FirstOrDefault(x => x.TaskId.ToString() == portlet.Context.ClaimPopUpTaskId);
                if (line != null)
                {
                    Logger.Log.Error("ClaimTask_GetTaskInfo #2");
                    var task = EntityManager<TaskBase>.Instance.LoadOrNull(line.TaskId);

                    var doclong = Int64.Parse(line.DocID);
                    var doc = EntityManager<Document>.Instance.LoadOrNull(doclong);

                    if (task != null && doc != null)
                    {
                        Logger.Log.Error("ClaimTask_GetTaskInfo #3");
                        //portlet.Context.ClaimPopUpText = String.Format(popuptext, (LinePortlet.Doc != null ? LinePortlet.Doc.Name : "no document info"), (LinePortlet.CreatedBy != null ? LinePortlet.CA_FullNameEng : "no author info"), LinePortlet.AssignedTo, LinePortlet.DueDate.ToString(), LinePortlet.Task.Subject);
                        portlet.Context.ClaimPopUpText = String.Format(popuptext, (doc != null ? doc.Name : "no document info"), (line.CreatedBy != null ? line.CA_FullNameEng : "no author info"), line.AssignedTo, line.DueDate.ToString(), task.Subject);

                        if (line.TaskStr != null && ClaimTask_CheckClaim(task))
                        {
                            Logger.Log.Error("ClaimTask_GetTaskInfo #4");
                            portlet.Context.ClaimPopUpText += canclaimtext;
                        }
                        else
                        {
                            Logger.Log.Error("ClaimTask_GetTaskInfo #5");
                            portlet.Context.Log += "LinePortlet.ExecutFullName 1 " + line.ExecutFullName.ToString();
                            portlet.Context.ClaimPopUpText += String.Format(cantclaimtext, (line.Executor != null ? line.ExecutFullName.ToString() : "Someone"));
                        }
                    }
                    else
                    {
                        portlet.Context.ClaimPopUpText = "Error: No task or document";
                    }
                }
                else
                {
                    portlet.Context.ClaimPopUpText = "Error: could not get task from group tasks";
                }
            }
            else
            {
                portlet.Context.ClaimPopUpText = "Error: no task Id";
            }

        }

        /// <summary>
        /// Claim Task из поп-апа
        /// </summary>
        /// <param name="portlet">Модель портлета</param>
        public virtual void ClaimTask_Execute(PortletContentViewModel<TasksDebug.Content, TasksDebug.Personalization> portlet)
        {
            if (!String.IsNullOrWhiteSpace(portlet.Context.ClaimPopUpTaskId))
            {
                var line = portlet.Context.GroupTasks.Where(x => x.TaskId.ToString() == portlet.Context.ClaimPopUpTaskId).FirstOrDefault();
                var task = EntityManager<DocumentApprovementTask>.Instance.LoadOrNull(line.TaskId);

                if (line != null)
                {
                    Logger.Log.Error("line: YES");
                }
                if (line.TaskId != null)
                {
                    Logger.Log.Error("LinePortlet.Task: YES" + line.TaskId.ToString());
                }
                Logger.Log.Error("ClaimTask_CheckClaim(LinePortlet.Task): " + ClaimTask_CheckClaim(line.Task).ToString());

                if (line != null && task != null && ClaimTask_CheckClaim(task))
                {
                    Logger.Log.Error("ClaimTask_Execute #2");
                    //claim task
                    if (task is DocumentApprovementTask)
                    {
                        Logger.Log.Error("ClaimTask_Execute #3");

                        ApprovementTaskManager.Instance.Assign((DocumentApprovementTask)task);
                        Logger.Log.Error("ClaimTask_Execute #3.5");
                    }
                    else
                    {
                        Logger.Log.Error("ClaimTask_Execute #4");
                        long taskID = (long)line.TaskId;
                        [Deleted].Tasks.Managers.TaskBaseManager.Instance.StartWork(taskID);
                        Logger.Log.Error("ClaimTask_Execute #4.5");
                    }
                    //Content_Load((PortletContentLoadViewModel<TasksDebug.Content, TasksDebug.Personalization> )portlet);
                }


            }
        }

        public bool ClaimTask_CheckClaim(TaskBase dt)
        {
            var usr = UserManager.Instance.GetCurrentUser();
            if (dt != null && dt.Executor == usr && TaskBaseExtensions.ActiveTaskStatuses.ToList().Contains(dt.Status))
            {
                return true;
            }
            return false;
        }

        /// <summary>
        /// Загрузка содержимого портлета
        /// </summary>
        /// <param name="portlet">Модель портлета</param>
        public void Content_Load1(PortletContentLoadViewModel<TasksDebug.Content, TasksDebug.Personalization> portlet)
        {

            var workTime = DateTime.Now;
            List<string> activeStatuses = new List<string>();
            activeStatuses.Add("34387afa-6b70-476f-9d34-748732059003".ToUpper());
            //NewOrder
            activeStatuses.Add("37a184b8-a81d-4177-9eb5-4ebe3dfae959".ToUpper());
            //InProgress
            activeStatuses.Add("85707efe-806c-4ec6-8cd6-4d5e4edd8b19".ToUpper());
            //Read
            activeStatuses.Add("112ea757-36f7-4859-b0d3-6cc0f5a04705".ToUpper());
            //Prepared
            activeStatuses.Add("b9c9f74a-15ec-4337-9916-f02ffec83dd4".ToUpper());
            //OnApproval
            activeStatuses.Add("b0b6a339-ba74-4e46-b721-2733d7fb76a9".ToUpper());
            //OnApprovalExecutor
            activeStatuses.Add("70918293-8b84-43be-ad39-181375d51373".ToUpper());
            //RefuseApprovalExecutor
            activeStatuses.Add("98ff43bd-b897-41f0-adf2-4eb3b3783851".ToUpper());
            //NoComplete
            var starttime = DateTime.Now;
            // Debug
            var user = AuthenticationService.GetCurrentUser<[Deleted].Security.Models.IUser>();

            
            List<UI.Portlets.TasksDebug.Content_MyTasks> lsts = new List<UI.Portlets.TasksDebug.Content_MyTasks>();
            List<UI.Portlets.TasksDebug.Content_Buffer> BUFlsts = new List<UI.Portlets.TasksDebug.Content_Buffer>();
            List<long?> wfb_id = new List<long?>();
            List<long?> instances = new List<long?>();
            List<string> elements = new List<string>();            
            var firstCommand = (@"
    with firstQuery as (
                    SELECT 
						tasks.Id as 'tasksId'													--0
						,tasks.[Subject]													    --1
					    ,tasks.[CreationAuthor]												    --2
						,uAuthor.LastName  uAuthorLastName					                    --3
						,uAuthor.FirstName  uAuthorFirstName                                    --4
						,uAuthor.MiddleName  uAuthorMiddleName                                  --5
					
						,uManager.Id  uManagerId												--6
						,uManager.LastName uManagerLastName                                     --7
						,uManager.FirstName uManagerFirstName                                   --8
						,uManager.MiddleName uManagerMiddleName                                 --9
					
						,uPartner.Id  uPartnerId											   --10
						,uPartner.LastName  uPartnerLastName                                   --11
						,uPartner.FirstName   uPartnerFirstName                                --12
						,uPartner.MiddleName   uPartnerMiddleName                              --13
				
						,uExecutor.Id  uExecutorId										       --14
						,uExecutor.LastName   uExecutorLastName                                --15
						,uExecutor.FirstName uExecutorFirstName                                --16
						,uExecutor.MiddleName uExecutorMiddleName                              --17
						,CAST(tasks.EndDate as smalldatetime) AS 'EndDate'				       --18	
						,lcs.Name AS 'Status'												   --19
						,doc.Id docId                                                --20
						,doc.[Description]                                      --21
						,cAgr.UsingTemplate                                     --22
                        ,wbm.[Instance] as 'wbmInstance_1'				                            --23
                        ,ali.[AppointApprovalUser] as 'wbmAppoint_1'                            --24
						,wbm.[ElementUid] as 'wbmElem_1'			                            --25
						,wbm.[Id] as 'wbmId_1'						                            --26
                        ,tasks.[TypeUid] tasksTypeUid                                       --27

                        ,uChanger.Id    uChangerId                                         --28
						,uChanger.LastName                                      --29
						,uChanger.FirstName                                     --30
						,uChanger.MiddleName                                    --31
                        ,dat.Id  as 'dat.Id'                                               --32
                        ,dms.TypeUid				                            --33
						,stA.Name                                               --34
                        ,uExecutor.FullNameEng  uExecutorFullNameEng                                --35
                        ,uAuthor.FullNameEng   uAuthorFullNameEng                                  --36
                        ,tasks.[Status] tasksStatus                                           --37
						,ali.ParentList as 'ParentList'
						

					FROM TaskBase AS tasks
					LEFT JOIN [WorkflowBookmark] AS wbm ON tasks.[WorkflowBookmark] = wbm.Id
					LEFT JOIN [WorkflowInstance] AS wi ON wbm.[Instance] = wi.Id
					LEFT JOIN [[Deleted]_ApprovementProcessData] AS apd ON wi.Id = apd.WorkflowInstance
					LEFT JOIN [DocumentApprovementTask] AS dat on dat.Id = tasks.Id
					LEFT JOIN [ApprovementListItem] AS ali on ali.Id = dat.ListItem
					LEFT JOIN [DmsObject] AS dms on dms.Id = apd.Doc
					LEFT JOIN [[Deleted]_ContractorAgreement] AS cAgr ON cAgr.Id = apd.Doc
					LEFT JOIN [DocumentTask] AS doctask on doctask.Id = tasks.Id
					LEFT JOIN [User] AS uManager ON cAgr.Responsible = uManager.Id
					LEFT JOIN [User] AS uAuthor ON tasks.CreationAuthor = uAuthor.Id
					LEFT JOIN [User] AS uExecutor ON tasks.Executor = uExecutor.Id
					LEFT JOIN [User] AS uPartner ON cAgr.EngagementPartner = uPartner.Id
                    LEFT JOIN [User] AS uChanger ON uChanger.Id = dms.ChangeAuthor
					LEFT JOIN [Document] AS doc ON doc.Id = apd.Doc
					LEFT JOIN [LifeCycleStatus] AS lcs ON lcs.Id = doc.[Status]
					LEFT JOIN StageApprovement AS stA On stA.Id = ali.Stage				
					
					WHERE tasks.[Executor] = @usr AND (tasks.[WorkflowBookmark] IS NULL AND tasks.[Status] 
					IN ('34387afa-6b70-476f-9d34-748732059003','37a184b8-a81d-4177-9eb5-4ebe3dfae959', '85707efe-806c-4ec6-8cd6-4d5e4edd8b19', 
					'112ea757-36f7-4859-b0d3-6cc0f5a04705','b9c9f74a-15ec-4337-9916-f02ffec83dd4','b0b6a339-ba74-4e46-b721-2733d7fb76a9', 
					'70918293-8b84-43be-ad39-181375d51373', '98ff43bd-b897-41f0-adf2-4eb3b3783851') OR wi.[Status] = 1)
					    AND (dms.IsDeleted=0 OR dms.IsDeleted is NULL) AND (doctask.Id IS NOT NULL OR doctask.Id is NULL) 
    ),  
    secondQuery as (
	                SELECT
                             wbm.[Id] as 'wbmId_2'		
                            ,tasks.[Subject] as 'sqSubject'
                            ,tasks.[Executor]
							,tasks.[EndDate]
                            ,tasks.[Status] as 'sqStatus'
                            ,wbm.[Instance] as 'wbmInstance_2'
                            ,tasks.[Id] as 'taskID'
                            ,wbm.[ElementUid] as 'wbmElem_2'
                            ,ali.[AppointApprovalUser] as 'wbmAppoint_2'
                            ,tasks.[TypeUid] as 'sqTypeUid'
                    FROM [WorkflowBookmark] as wbm
                    LEFT JOIN [TaskBase] AS tasks ON tasks.[WorkflowBookmark] = wbm.[Id]
                    LEFT JOIN [DocumentApprovementTask] AS dat on dat.Id = tasks.Id
                    LEFT JOIN [ApprovementListItem] AS ali on ali.Id = dat.[ListItem]
                    WHERE wbm.[ElementUid] IN (select wbmElem_1 from firstQuery) AND tasks.[Status]
					IN ('34387afa-6b70-476f-9d34-748732059003','37a184b8-a81d-4177-9eb5-4ebe3dfae959', '85707efe-806c-4ec6-8cd6-4d5e4edd8b19', 
					'112ea757-36f7-4859-b0d3-6cc0f5a04705','b9c9f74a-15ec-4337-9916-f02ffec83dd4','b0b6a339-ba74-4e46-b721-2733d7fb76a9', 
					'70918293-8b84-43be-ad39-181375d51373', '98ff43bd-b897-41f0-adf2-4eb3b3783851') AND wbm.[Instance] IN (select wbmInstance_1 from firstQuery)
    ),
    thirdQuery as (
			    SELECT 
			    *
				,(SELECT 
				CASE count(*)
					WHEN 0 THEN NULL
					ELSE count(*) 
				END
				from secondQuery as sq 
				where 
				sq.[wbmElem_2] = fq.[wbmElem_1] and
				sq.[wbmInstance_2] = fq.[wbmInstance_1] and
				sq.[wbmId_2] = fq.[wbmId_1]) as 'count_'
				,(SELECT
				min(secondQuery.Executor)
				FROM secondQuery
				where secondQuery.wbmInstance_2 = fq.wbmInstance_1 and secondQuery.sqStatus in ('37a184b8-a81d-4177-9eb5-4ebe3dfae959', '85707efe-806c-4ec6-8cd6-4d5e4edd8b19', '34387afa-6b70-476f-9d34-748732059003  ')) as 'CurrentUser'
				,(SELECT 
				min(sqq.EndDate)
				From secondQuery as sqq
				where sqq.wbmInstance_2 = fq.wbmInstance_1 and sqq.sqStatus in ('34387afa-6b70-476f-9d34-748732059003', '37a184b8-a81d-4177-9eb5-4ebe3dfae959', '85707efe-806c-4ec6-8cd6-4d5e4edd8b19')
				) as 'EndDate2'
			    FROM firstQuery as fq
			--	LEFT JOIN 
			--	(Select
			--	sqq.Executor
			--	FROM secondQuery as sqq				 
			--	) AS sq2 ON sq2.hui > 1
    )
			
    SELECT
    *
    from thirdQuery as tq
    where 
    tq.count_ IS NOT NULL 
    --and tq.tasksId = '186047' 
    --and tq.tasksId = '188276'
    Order by tq.EndDate desc

                                                                        ");

            Dictionary<string, object> myDict = new Dictionary<string, object>
            {
                { "usr", user.Id.ToString() }
            };

            var controllerContext = ControllerContextCreator.Create(new FakeController());
            var CC = controllerContext.RequestContext;
            var Url = new System.Web.Mvc.UrlHelper(CC);

            #region using
            using (var reader = transformProv.ExecuteQuery(firstCommand, myDict))
            {
                if (reader != null)
                {
                    try
                    {
                        while (reader.Read())
                        {
                            var LinePortlet = new TasksDebug.Content_MyTasks();
                            var BUFlinePortlet = new TasksDebug.Content_Buffer();
                            //default values

                            BUFlinePortlet.Serv_show = false;
                            LinePortlet.Service_Show = BUFlinePortlet.Serv_show;
                            BUFlinePortlet.Serv_group = null;
                            LinePortlet.Service_GroupTask = BUFlinePortlet.Serv_show;
                            //заполнение общих полей в портлете

                            if (!reader.IsDBNull(0) && reader.GetInt64(0) > 0)                                                                  //TaskId
                            {
                                var taskID = reader.GetInt64(0);
                                if (!string.IsNullOrEmpty(taskID.ToString()) && !string.IsNullOrWhiteSpace(taskID.ToString()))
                                {
                                    BUFlinePortlet.TaskID = reader.GetInt64(0).ToString();
                                }

                                if (BUFlinePortlet.TaskID != null)
                                {
                                    LinePortlet.TaskId = Convert.ToInt64(BUFlinePortlet.TaskID);
                                }
                            }

                            if (!reader.IsDBNull(1))                                                                                            //task_Subject
                            {
                                BUFlinePortlet.TaskSubject = reader.GetString(1);

                                if (BUFlinePortlet.TaskSubject != null)
                                {
                                    LinePortlet.TaskSubject = BUFlinePortlet.TaskSubject;
                                }
                            }


                            if (!reader.IsDBNull(2)) // taskCA
                            {
                                BUFlinePortlet.TaskCAid = reader.GetInt64(2).ToString();
                            }
                            if (!reader.IsDBNull(3)) //CA_last
                            {
                                BUFlinePortlet.CA_last = reader.GetString(3).ToString();
                            }
                            if (!reader.IsDBNull(4)) //CA_first
                            {
                                BUFlinePortlet.CA_last = reader.GetString(4).ToString();
                            }
                            if (!reader.IsDBNull(5)) //CA_mid
                            {
                                BUFlinePortlet.CA_last = reader.GetString(5).ToString();
                            }


                            if (!reader.IsDBNull(6)) //PM_id
                            {
                                BUFlinePortlet.EngagementManager = reader.GetInt64(6).ToString();
                            }
                            if (!reader.IsDBNull(7)) //PM_last
                            {
                                BUFlinePortlet.PM_last = reader.GetString(7).ToString();
                            }
                            if (!reader.IsDBNull(8)) //PM_first
                            {
                                BUFlinePortlet.PM_first = reader.GetString(8).ToString();
                            }
                            if (!reader.IsDBNull(9)) //PM_mid
                            {
                                BUFlinePortlet.PM_mid = reader.GetString(9).ToString();
                            }


                            if (!reader.IsDBNull(10)) //PP_id
                            {
                                BUFlinePortlet.EngagementPartner = reader.GetInt64(10).ToString();
                            }
                            if (!reader.IsDBNull(11)) //PP_last
                            {
                                BUFlinePortlet.PP_last = reader.GetString(11).ToString();
                            }
                            if (!reader.IsDBNull(12)) //PP_first
                            {
                                BUFlinePortlet.PP_first = reader.GetString(12).ToString();
                            }
                            if (!reader.IsDBNull(13)) //PP_mid
                            {
                                BUFlinePortlet.PP_mid = reader.GetString(13).ToString();
                            }

                            if (!reader.IsDBNull(14)) //executor_id
                            {
                                BUFlinePortlet.TaskExecutorID = reader.GetInt64(14).ToString();
                            }
                            if (!reader.IsDBNull(15)) //executor_last
                            {
                                BUFlinePortlet.TE_last = reader.GetString(15).ToString();
                            }
                            if (!reader.IsDBNull(16)) //executor_first
                            {
                                BUFlinePortlet.TE_first = reader.GetString(16).ToString();
                            }
                            if (!reader.IsDBNull(17)) //executor_mid
                            {
                                BUFlinePortlet.TE_mid = reader.GetString(17).ToString();
                            }


                            if (!reader.IsDBNull(18)) //EndDate
                            {
                                BUFlinePortlet.EndDate = reader.GetDateTime(18).ToString();
                                if (!string.IsNullOrWhiteSpace(BUFlinePortlet.EndDate))
                                {
                                    var date = DateTime.Parse(BUFlinePortlet.EndDate);
                                    if (date != null)
                                    {
                                        LinePortlet.DueDate = date;
                                    }
                                }
                            }

                            if (!reader.IsDBNull(19)) //Status_!!!!!!!!!!!!!! DOCUMENT !!!!!!!!!!!!!
                            {
                                BUFlinePortlet.TaskStatus = reader.GetString(19).ToString();
                            }
                            else
                            {
                                BUFlinePortlet.TaskStatus = "null";
                            }


                            if (!reader.IsDBNull(20)) //doc_id
                            {
                                BUFlinePortlet.DocID = reader.GetInt64(20).ToString();
                                if (BUFlinePortlet.DocID != null)
                                {
                                    LinePortlet.Doc = BUFlinePortlet.DocID;
                                }
                            }
                            if (!reader.IsDBNull(21)) //doc_comment
                            {
                                BUFlinePortlet.Doc_Comment = reader.GetString(21).ToString();

                                if (!string.IsNullOrWhiteSpace(BUFlinePortlet.Doc_Comment))
                                {
                                    LinePortlet.Comment = BUFlinePortlet.Doc_Comment;
                                }
                            }

                            if (!reader.IsDBNull(22)) //doc_UsingTemplate
                            {
                                BUFlinePortlet.Doc_usingtamplate = reader.GetInt64(22).ToString();

                                if (!string.IsNullOrWhiteSpace(BUFlinePortlet.Doc_usingtamplate))
                                {
                                    LinePortlet.UsingTemplate_str = BUFlinePortlet.Doc_usingtamplate;
                                }
                            }
                            if (!reader.IsDBNull(23)) //Wfb_instance
                            {
                                BUFlinePortlet.Wfb_instance = reader.GetInt64(23).ToString();

                                if (!string.IsNullOrWhiteSpace(BUFlinePortlet.Wfb_instance))
                                {
                                    long instID;

                                    bool chck = Int64.TryParse(BUFlinePortlet.Wfb_instance, out instID);
                                    if (chck)
                                    {
                                        LinePortlet.InstanceId = instID;
                                    }
                                }
                            }

                            if (!reader.IsDBNull(24)) //AppointUser
                            {
                                BUFlinePortlet.AppointUser = reader.GetInt64(24).ToString();

                                long AppointUserFIN;
                                bool result = Int64.TryParse(BUFlinePortlet.AppointUser, out AppointUserFIN);
                                if (result)
                                {
                                    LinePortlet.AppointUser = AppointUserFIN;
                                }

                            }

                            if (!reader.IsDBNull(25)) //Wfb_elementUID
                            {
                                BUFlinePortlet.Wfb_elementUID = reader.GetGuid(25).ToString().ToUpper();
                                if (BUFlinePortlet.Wfb_elementUID != null)
                                {
                                    LinePortlet.ElementUid = BUFlinePortlet.Wfb_elementUID;
                                }
                            }
                            if (!reader.IsDBNull(26)) //Wfb_ID
                            {
                                BUFlinePortlet.Wfb_ID = reader.GetInt64(26).ToString();
                                if (!string.IsNullOrWhiteSpace(BUFlinePortlet.Wfb_ID))
                                {
                                    LinePortlet.Wfb_ID = Int64.Parse(BUFlinePortlet.Wfb_ID);
                                }
                            }
                            if (!reader.IsDBNull(27)) //Task_TypeUid
                            {
                                BUFlinePortlet.Task_TypeUid = reader.GetGuid(27).ToString();
                                if (BUFlinePortlet.Task_TypeUid != null)
                                {
                                    LinePortlet.TypeUid = new Guid(BUFlinePortlet.Task_TypeUid);
                                }
                            }


                            if (!reader.IsDBNull(28)) //change_id
                            {
                                BUFlinePortlet.ChangerID = reader.GetInt64(28).ToString();
                            }
                            if (!reader.IsDBNull(29)) //change_last
                            {
                                BUFlinePortlet.Ch_last = reader.GetString(29).ToString();
                            }
                            if (!reader.IsDBNull(30)) //change_first
                            {
                                BUFlinePortlet.Ch_first = reader.GetString(30).ToString();
                            }
                            if (!reader.IsDBNull(31)) // change_mid
                            {
                                BUFlinePortlet.Ch_mid = reader.GetString(31).ToString();
                            }

                            #region DAT_task
                            if (!reader.IsDBNull(32)) //DAT_task
                            {
                                BUFlinePortlet.DAT_Task = reader.GetInt64(32).ToString();
                            }
                            else
                            {
                                BUFlinePortlet.DAT_Task = "null";
                            }
                            LinePortlet.DAT_Task = BUFlinePortlet.DAT_Task;
                            #endregion

                            if (!reader.IsDBNull(33)) // Doc_TypeUid
                            {
                                BUFlinePortlet.Doc_TypeUid = reader.GetGuid(33).ToString();

                                if (BUFlinePortlet.Doc_TypeUid != null)
                                {
                                    LinePortlet.Doc_TypeUid = BUFlinePortlet.Doc_TypeUid;
                                }
                            }

                            #region AppListStatus
                            if (!reader.IsDBNull(34)) // AppListStatus
                            {
                                BUFlinePortlet.AppListStatus = reader.GetString(34).ToString();
                                LinePortlet.ApprovalStatusName = BUFlinePortlet.AppListStatus;
                            }
                            else
                            {
                                BUFlinePortlet.Task_status = "null";

                                if (!string.IsNullOrWhiteSpace(BUFlinePortlet.TaskStatus))
                                {
                                    LinePortlet.ApprovalStatusName = BUFlinePortlet.TaskStatus;
                                }
                                if (LinePortlet.ApprovalStatusName == "null")
                                {
                                    LinePortlet.ApprovalStatusName = "";
                                }
                            }
                            #endregion

                            if (!reader.IsDBNull(35)) // ExecutFullName
                            {
                                BUFlinePortlet.ExecutFullName = reader.GetString(35).ToString();
                                if (BUFlinePortlet.ExecutFullName != null)
                                {
                                    LinePortlet.ExecutFullName = BUFlinePortlet.ExecutFullName;
                                }
                            }

                            if (!reader.IsDBNull(36)) // CA_FullNameEng
                            {
                                BUFlinePortlet.CA_FullNameEng = reader.GetString(36).ToString();

                                if (BUFlinePortlet.CA_FullNameEng != null)
                                {
                                    LinePortlet.CA_FullNameEng = BUFlinePortlet.CA_FullNameEng;
                                }
                            }
                            if (!reader.IsDBNull(37)) // task status
                            {
                                BUFlinePortlet.Task_status = reader.GetGuid(37).ToString();

                                if (BUFlinePortlet.Task_status != null)
                                {
                                    LinePortlet.Task_status = BUFlinePortlet.Task_status;
                                }
                            }
                            if (!reader.IsDBNull(39)) // TSKCNT
                            {
                                BUFlinePortlet.Tskcnt_buff = reader.GetInt64(39);

                                if (BUFlinePortlet.Tskcnt_buff != null)
                                {
                                    LinePortlet.Tskcnt = BUFlinePortlet.Tskcnt_buff;
                                }
                            }


                            if (!reader.IsDBNull(38)) // ParentList
                            {
                                BUFlinePortlet.ParentList = reader.GetInt64(38);

                                if (BUFlinePortlet.ParentList != null)
                                {
                                    LinePortlet.ParentList = BUFlinePortlet.ParentList;
                                    portlet.Context.Log += "LinePortlet.ParentList == " + LinePortlet.ParentList.ToString() + "\n";
                                }
                                else
                                {
                                    LinePortlet.ParentList = null;
                                    portlet.Context.Log += "LinePortlet.ParentList == NULL \n";
                                }

                            }

                            if (!reader.IsDBNull(40)) // CurrentUser
                            {
                                BUFlinePortlet.CurrentUserId = reader.GetInt64(40);

                                if (BUFlinePortlet.CurrentUserId != null)
                                {
                                    LinePortlet.CurrentUserId = BUFlinePortlet.CurrentUserId;
                                }
                            }
                            else
                            {
                                LinePortlet.CurrentUserId = null;
                            }

                            if (!reader.IsDBNull(41)) // EendDate_2
                            {
                                BUFlinePortlet.EndDate2 = reader.GetDateTime(41).ToString();

                                if (BUFlinePortlet.EndDate2 != null)
                                {
                                    LinePortlet.EndDate2 = BUFlinePortlet.EndDate2;
                                }
                            }
                            else
                            {
                                LinePortlet.EndDate2 = null;
                            }




                            var task_guid = new Guid(BUFlinePortlet.Task_TypeUid);
                            string taskurl = UrlExtensions.Entity(Url, task_guid, BUFlinePortlet.TaskID);
                            LinePortlet.TaskStr = new HtmlString(String.Format("<a href=\"{0}\" target=\"_blank\">{1}</a>", taskurl, BUFlinePortlet.TaskSubject));


                            if (BUFlinePortlet.TaskCAid != null && !string.IsNullOrWhiteSpace(BUFlinePortlet.TaskCAid))
                            {
                                var CAguid = new Guid("18faf3ae-03c9-4e64-b02a-95dd63e54c4d");
                                string CAurl = UrlExtensions.Entity(Url, CAguid, BUFlinePortlet.TaskCAid);
                                string CAsubject = "";
                                if (!string.IsNullOrWhiteSpace(BUFlinePortlet.CA_last) && !string.IsNullOrWhiteSpace(BUFlinePortlet.CA_first))
                                {
                                    CAsubject = BUFlinePortlet.CA_last + " " + BUFlinePortlet.CA_first[0] + ".";
                                }
                                else if (!string.IsNullOrWhiteSpace(BUFlinePortlet.CA_last) && !string.IsNullOrWhiteSpace(BUFlinePortlet.CA_first) && !string.IsNullOrWhiteSpace(BUFlinePortlet.CA_mid))
                                {
                                    CAsubject = BUFlinePortlet.CA_last + " " + BUFlinePortlet.CA_first[0] + "." + BUFlinePortlet.CA_mid[0] + ".";
                                }
                                LinePortlet.CreatedBy = new HtmlString(String.Format("<a href=\"{0}\" target=\"_blank\">{1}</a>", CAurl, CAsubject));
                            }

                            if (BUFlinePortlet.EngagementManager != null && !string.IsNullOrWhiteSpace(BUFlinePortlet.EngagementManager))
                            {
                                var EMguid = new Guid("18faf3ae-03c9-4e64-b02a-95dd63e54c4d");
                                string EMurl = UrlExtensions.Entity(Url, EMguid, BUFlinePortlet.EngagementManager);
                                string EMsubject = "";

                                //Logger.Log.Error(" =buffer_work= PM: last: " + row.PM_last + "first: " + row.PM_first + "\n");
                                if (!string.IsNullOrWhiteSpace(BUFlinePortlet.PM_last) && !string.IsNullOrWhiteSpace(BUFlinePortlet.PM_first))
                                {
                                    EMsubject = BUFlinePortlet.PM_last + " " + BUFlinePortlet.PM_first[0] + ".";
                                }
                                else if (!string.IsNullOrWhiteSpace(BUFlinePortlet.PM_last) && !string.IsNullOrWhiteSpace(BUFlinePortlet.PM_first) && !string.IsNullOrWhiteSpace(BUFlinePortlet.PM_mid))
                                {
                                    EMsubject = BUFlinePortlet.PM_last + " " + BUFlinePortlet.PM_first[0] + "." + BUFlinePortlet.PM_mid[0] + ".";
                                }
                                // Logger.Log.Error("manager name builder: " + EMsubject);
                                LinePortlet.EngagementManager = new HtmlString(String.Format("<a href=\"{0}\" target=\"_blank\">{1}</a>", EMurl, EMsubject));
                            }

                            if (BUFlinePortlet.EngagementPartner != null && !string.IsNullOrWhiteSpace(BUFlinePortlet.EngagementPartner))
                            {
                                var EPguid = new Guid("18faf3ae-03c9-4e64-b02a-95dd63e54c4d");
                                string EPurl = UrlExtensions.Entity(Url, EPguid, BUFlinePortlet.EngagementPartner);
                                string EPsubject = "";
                                //Logger.Log.Error(" =buffer_work= PM: last: " + row.PP_last + "first: " + row.PP_first + "\n");
                                if (!string.IsNullOrWhiteSpace(BUFlinePortlet.PP_last) && !string.IsNullOrWhiteSpace(BUFlinePortlet.PP_first))
                                {
                                    EPsubject = BUFlinePortlet.PP_last + " " + BUFlinePortlet.PP_first[0] + ".";
                                }
                                else if (!string.IsNullOrWhiteSpace(BUFlinePortlet.PP_last) && !string.IsNullOrWhiteSpace(BUFlinePortlet.PP_first) && !string.IsNullOrWhiteSpace(BUFlinePortlet.PP_mid))
                                {
                                    EPsubject = BUFlinePortlet.PP_last + " " + BUFlinePortlet.PP_first[0] + "." + BUFlinePortlet.PP_mid[0] + ".";
                                }
                                //Logger.Log.Error("manager name builder: " + EPsubject);
                                LinePortlet.EngagementPartner = new HtmlString(String.Format("<a href=\"{0}\" target=\"_blank\">{1}</a>", EPurl, EPsubject));
                            }


                            if (!string.IsNullOrEmpty(BUFlinePortlet.ChangerID) && !string.IsNullOrWhiteSpace(BUFlinePortlet.ChangerID))
                            {
                                var chID = Int64.Parse(BUFlinePortlet.ChangerID);
                                if (chID != null && !string.IsNullOrWhiteSpace(BUFlinePortlet.ChangerID))
                                {
                                    var CHguid = new Guid("18faf3ae-03c9-4e64-b02a-95dd63e54c4d");
                                    string CHurl = UrlExtensions.Entity(Url, CHguid, BUFlinePortlet.ChangerID);
                                    string CHsubject = "";
                                    if (!string.IsNullOrWhiteSpace(BUFlinePortlet.Ch_last) && !string.IsNullOrWhiteSpace(BUFlinePortlet.Ch_first))
                                    {
                                        CHsubject = BUFlinePortlet.Ch_last + " " + BUFlinePortlet.Ch_first[0] + ".";
                                    }
                                    else if (!string.IsNullOrWhiteSpace(BUFlinePortlet.Ch_last) && !string.IsNullOrWhiteSpace(BUFlinePortlet.Ch_first) && !string.IsNullOrWhiteSpace(BUFlinePortlet.Ch_mid))
                                    {
                                        CHsubject = BUFlinePortlet.Ch_last + " " + BUFlinePortlet.Ch_first[0] + "." + BUFlinePortlet.Ch_mid[0] + ".";
                                    }
                                    //Logger.Log.Error("manager name builder: " + CHsubject);
                                    LinePortlet.ChangeAuthor = new HtmlString(String.Format("<a href=\"{0}\" target=\"_blank\">{1}</a>", CHurl, CHsubject));
                                }
                            }

                            var executorID = Convert.ToInt64(BUFlinePortlet.TaskExecutorID);

                            if (executorID != null && !string.IsNullOrWhiteSpace(BUFlinePortlet.TaskExecutorID))
                            {
                                var EXguid = new Guid("18faf3ae-03c9-4e64-b02a-95dd63e54c4d");
                                string EXurl = UrlExtensions.Entity(Url, EXguid, BUFlinePortlet.TaskExecutorID);
                                string EXsubject = "";
                                if (!string.IsNullOrWhiteSpace(BUFlinePortlet.TE_last) && !string.IsNullOrWhiteSpace(BUFlinePortlet.TE_first))
                                {
                                    EXsubject = BUFlinePortlet.TE_last + " " + BUFlinePortlet.TE_first[0] + ".";
                                }
                                else if (!string.IsNullOrWhiteSpace(BUFlinePortlet.TE_last) && !string.IsNullOrWhiteSpace(BUFlinePortlet.TE_first) && !string.IsNullOrWhiteSpace(BUFlinePortlet.TE_mid))
                                {
                                    EXsubject = BUFlinePortlet.TE_last + " " + BUFlinePortlet.TE_first[0] + "." + BUFlinePortlet.TE_mid[0] + ".";
                                }
                                LinePortlet.ExecutFullName = EXsubject;
                                LinePortlet.Executor = new HtmlString(String.Format("<a href=\"{0}\" target=\"_blank\">{1}</a>", EXurl, EXsubject));
                            }


                            LinePortlet.Docflow = new HtmlString(String.Format("<a href=\"/Workflow/WorkflowInstance/Map/{0}\" target=\"_blank\">Карта</a>", LinePortlet.InstanceId));


                            if (executorID == user.Id && activeStatuses.Contains(BUFlinePortlet.Task_status.ToUpper()))
                            {
                                LinePortlet.Service_Show = true;
                                LinePortlet.Service_GroupTask = false;
                                // исполнитель = текущий пользователь, вероятно задача личная
                            }

                            if (activeStatuses.Contains(BUFlinePortlet.Task_status.ToUpper())) 
                            {
                                LinePortlet.Service_Show = true;

                            }
                            BUFlinePortlet.Save();
                            BUFlsts.Add(BUFlinePortlet);



                            bool groupExecutor = false;
                            
                            if (LinePortlet.ElementUid != null && !string.IsNullOrEmpty(LinePortlet.ElementUid))
                            {


                                var taskscount = LinePortlet.Tskcnt;
                                if (taskscount > 1)
                                {
                                    LinePortlet.Service_GroupTask = true;
                                    LinePortlet.Service_Show = true;
                                    portlet.Context.Log += "(taskscount > 1) == " + LinePortlet.TaskId.ToString() + "  " + taskscount.ToString() + "\n";
                                    portlet.Context.Log += "\n";
                                }
                                else if (taskscount == 1)
                                {
                                    if (LinePortlet.Service_GroupTask == false)
                                    {
                                        LinePortlet.Service_Show = true;
                                        portlet.Context.Log += "(taskscount == 1) == " + LinePortlet.TaskId.ToString() + "  " + taskscount.ToString() + "\n";
                                        portlet.Context.Log += "\n";

                                        if (LinePortlet.ParentList == null && LinePortlet.DAT_Task != "null") //задача имеет каунт == 1, но ParentList == Null. значит, что задача была закрыта\удалена из листа согласования. в групповых.
                                        {
                                            LinePortlet.Service_GroupTask = true;

                                        }

                                    }
                                    else
                                    {

                                        LinePortlet.Service_GroupTask = true;
                                        groupExecutor = true;
                                        LinePortlet.Service_Show = true;
                                        portlet.Context.Log += "(taskscount != 1) == " + LinePortlet.TaskId.ToString() + "  " + taskscount.ToString() + "\n";
                                        portlet.Context.Log += "\n";
                                    }
                                }
                                else
                                {
                                    LinePortlet.Service_Show = false;
                                    portlet.Context.Log += "(taskscount == 0) == " + LinePortlet.TaskId.ToString() + "  " + taskscount.ToString() + "\n";
                                    portlet.Context.Log += "\n";
                                }


                                if (!activeStatuses.Contains(LinePortlet.Task_status.ToUpper()) && LinePortlet.Wfb_ID != null && LinePortlet.Service_Show == true)
                                {
                                        if (LinePortlet.InstanceId != null)
                                        {
                                            if (LinePortlet.TaskId != null)
                                            {

                                                var task_guid_1 = LinePortlet.TypeUid;
                                                string taskurl_1 = UrlExtensions.Entity(Url, task_guid_1, LinePortlet.TaskId.ToString());
                                                LinePortlet.TaskStr = new HtmlString(String.Format("<a href=\"{0}\" target=\"_blank\">{1}</a>", taskurl_1, LinePortlet.TaskSubject));

                                                LinePortlet.DueDate = LinePortlet.DueDate;

                                            }

                                            if (LinePortlet.ChangeAuthor != null)
                                            {
                                                LinePortlet.CreatedBy = LinePortlet.ChangeAuthor;
                                            }
                                            else
                                                if (LinePortlet.CreatedBy != null)
                                            {
                                                LinePortlet.CreatedBy = LinePortlet.CreatedBy;
                                            }

                                            if (LinePortlet.ApprovalStatusName != null)
                                            {
                                                LinePortlet.ApprovalStatusName = LinePortlet.ApprovalStatusName;
                                            }

                                            if (LinePortlet.Executor != null)
                                            {
                                                LinePortlet.Executor = LinePortlet.Executor;
                                            }
                                            if (LinePortlet.ExecutFullName != null)
                                            {
                                                LinePortlet.ExecutFullName = LinePortlet.ExecutFullName;
                                            }
                                            if (!string.IsNullOrEmpty(LinePortlet.ElementUid))
                                            {
                                                LinePortlet.ElementUid = LinePortlet.ElementUid;
                                            }
                                            if (groupExecutor == true && LinePortlet.Service_GroupTask == true)
                                            {
                                                LinePortlet.TaskTEMP = LinePortlet.TaskStr;
                                                executorTEMP = LinePortlet.Executor;

                                                DueDate_temp = LinePortlet.DueDate;
                                                portlet.Context.Log += "DueDate_temp0 " + DueDate_temp.ToString() + "\n";


                                            }
                                        }
                                }


                                if (LinePortlet.Service_Show == true)
                                {

                                    if (string.IsNullOrWhiteSpace(LinePortlet.DAT_Task))
                                    {
                                        if (string.IsNullOrWhiteSpace(LinePortlet.Doc_TypeUid))
                                        {
                                            var Doctypeuid = new Guid(LinePortlet.Doc_TypeUid);
                                            string taskurlApp = UrlExtensions.Entity(Url, Doctypeuid, LinePortlet.Doc);
                                            LinePortlet.Docflow = new HtmlString(String.Format("<a href=\"{0}\" target=\"_blank\">Approval</a>", taskurlApp + "?selectedTab=Approvement"));
                                        }
                                    }

                                    var diagramassigntostart = DateTime.Now;
                                    [Deleted].Diagrams.Diagram diagram = null;
                                    if (LinePortlet.Wfb_ID != null)//В конец
                                    {
                                        var ins = PublicAPI.Processes.WorkflowInstance.LoadOrNull(LinePortlet.InstanceId);
                                        diagram = ins.Process.Diagram;
                                        if (diagram != null)
                                        {
                                            var line_elemUID = new Guid(LinePortlet.ElementUid);
                                            var element = diagram.Elements.FirstOrDefault(x => x.Uid == line_elemUID);
                                            if (element != null)
                                            {
                                                var taskelement = element as [Deleted].Documents.BPMN.Diagrams.Elements.Approvement.ApprovementElement;
                                                if (taskelement != null)
                                                {
                                                    var swimlane = taskelement.GetSwimlane(diagram);
                                                    LinePortlet.AssignedTo = swimlane.Name;

                                                    if (LinePortlet.Service_GroupTask == true && LinePortlet.Service_Show == true)
                                                    {
                                                        if (LinePortlet.Task_status.Contains("fd7993c6-99c7-4b23-83cc-0f576a63c144") || LinePortlet.Task_status == "fd7993c6-99c7-4b23-83cc-0f576a63c144")
                                                        {
                                                            var sds = ins.Process.Id;
                                                            var dsds = PublicAPI.Processes.WorkflowTaskBase.Filter().InstanceId(LinePortlet.InstanceId).SwimlaneUid(swimlane.Uid).Find();
                                                            //portlet.Context.Log += "\n \n";
                                                            foreach (var task in dsds)
                                                            {

                                                                if (TaskBaseExtensions.ActiveTaskStatuses.Contains(task.Status))
                                                                {
                                                                    //portlet.Context.Log += "item task" + item.Id.ToString() + " ---- item executor " + item.Executor.ToString() + "\n";

                                                                    var EXguid = new Guid("18faf3ae-03c9-4e64-b02a-95dd63e54c4d");
                                                                    string EXurl = UrlExtensions.Entity(Url, EXguid, task.Executor.Id.ToString());
                                                                    string EXsubject = "";


                                                                    if (!string.IsNullOrWhiteSpace(task.Executor.LastName) && !string.IsNullOrWhiteSpace(task.Executor.FirstName))
                                                                    {
                                                                        EXsubject = task.Executor.LastName + " " + task.Executor.FirstName[0] + ".";
                                                                    }
                                                                    else if (!string.IsNullOrWhiteSpace(task.Executor.LastName) && !string.IsNullOrWhiteSpace(task.Executor.FirstName) && !string.IsNullOrWhiteSpace(task.Executor.MiddleName))
                                                                    {
                                                                        EXsubject = task.Executor.LastName + " " + task.Executor.FirstName[0] + "." + task.Executor.MiddleName[0] + ".";
                                                                    }
                                                                    //Logger.Log.Error("manager name builder: " + EXsubject);
                                                                    var oneAll = new HtmlString(String.Format("<a href=\"{0}\" target=\"_blank\">{1}</a>", EXurl, EXsubject));


                                                                    executorTEMP = oneAll;
                                                                    DueDate_temp = task.EndDate;
                                                                }
                                                            }
                                                        }
                                                    }

                                                    var assigndiagexectime = DateTime.Now - diagramassigntostart;

                                                }
                                                else
                                                {
                                                    var usertaskelement = element as [Deleted].Workflow.BPMN.Diagrams.Elements.Tasks.TaskElement;
                                                    if (usertaskelement != null)
                                                    {
                                                        var swimlane = usertaskelement.GetSwimlane(diagram);
                                                        LinePortlet.AssignedTo = swimlane.Name;
                                                        var assigndiagexectime = DateTime.Now - diagramassigntostart;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (LinePortlet.DAT_Task != null && string.IsNullOrWhiteSpace(LinePortlet.DAT_Task))
                                {
                                    if (LinePortlet.AppListStatus != null && string.IsNullOrWhiteSpace(LinePortlet.AppListStatus))
                                    {
                                        LinePortlet.ApprovalStatusName = LinePortlet.AppListStatus;
                                    }
                                }
                                else if (LinePortlet.ApprovalStatusName != null && string.IsNullOrWhiteSpace(LinePortlet.ApprovalStatusName))
                                {
                                    LinePortlet.ApprovalStatusName = LinePortlet.ApprovalStatusName;
                                }


                                if (LinePortlet.ChangeAuthor != null)
                                {
                                    LinePortlet.CreatedBy = LinePortlet.ChangeAuthor;
                                }
                                else if (LinePortlet.CreatedBy != null)
                                {
                                    LinePortlet.CreatedBy = LinePortlet.CreatedBy;
                                }

                                if (!string.IsNullOrWhiteSpace(LinePortlet.UsingTemplate_str))
                                {
                                    if (LinePortlet.UsingTemplate_str == "1")
                                    {
                                        LinePortlet.UsingTemplate = EnumHelper.GetDisplayName(ConfigurationModel.[Deleted]_UsingTemplate.Standart);
                                    }
                                    if (LinePortlet.UsingTemplate_str == "2")
                                    {
                                        LinePortlet.UsingTemplate = EnumHelper.GetDisplayName(ConfigurationModel.[Deleted]_UsingTemplate.NonStandart[Deleted]);
                                    }
                                    if (LinePortlet.UsingTemplate_str == "3")
                                    {
                                        LinePortlet.UsingTemplate = EnumHelper.GetDisplayName(ConfigurationModel.[Deleted]_UsingTemplate.NonStandart);
                                    }
                                    if (LinePortlet.UsingTemplate_str == "4")
                                    {
                                        LinePortlet.UsingTemplate = EnumHelper.GetDisplayName(ConfigurationModel.[Deleted]_UsingTemplate.UserAttached[Deleted]);
                                    }
                                }
                                if (LinePortlet.Comment != null)
                                {
                                    LinePortlet.Comment = LinePortlet.Comment;
                                }

                                var first_exectime = DateTime.Now - starttime;
                            }
                            

                            
                            else if (activeStatuses.Contains(LinePortlet.ApprovalStatusName))
                            {
                                if (activeStatuses.Contains(LinePortlet.ApprovalStatusName) && LinePortlet.Wfb_ID == null && LinePortlet.Service_Show == true)
                                {
                                        if (LinePortlet.InstanceId != null)
                                        {
                                            if (LinePortlet.TaskId != null)
                                            {
                                                var buff_tu = LinePortlet.TypeUid;
                                                string taskurl_2 = UrlExtensions.Entity(Url, buff_tu, LinePortlet.TaskId.ToString());
                                                LinePortlet.TaskStr = new HtmlString(String.Format("<a href=\"{0}\" target=\"_blank\">{1}</a>", taskurl_2, LinePortlet.Task.ToString()));

                                                LinePortlet.DueDate = LinePortlet.DueDate;
                                            }
                                            if (LinePortlet.ChangeAuthor != null)
                                            {
                                                LinePortlet.CreatedBy = LinePortlet.ChangeAuthor;
                                            }
                                            else if (LinePortlet.CreatedBy != null)
                                            {
                                                LinePortlet.CreatedBy = LinePortlet.CreatedBy;
                                            }
                                            if (LinePortlet.ApprovalStatusName != null && string.IsNullOrWhiteSpace(LinePortlet.ApprovalStatusName))
                                            {
                                                LinePortlet.ApprovalStatusName = LinePortlet.ApprovalStatusName;
                                            }

                                            if (LinePortlet.Executor != null)
                                            {
                                                LinePortlet.Executor = LinePortlet.Executor;
                                            }

                                            if (LinePortlet.ExecutFullName != null)
                                            {
                                                LinePortlet.ExecutFullName = LinePortlet.ExecutFullName;
                                            }

                                            if (!string.IsNullOrEmpty(LinePortlet.ElementUid))
                                            {
                                                LinePortlet.ElementUid = LinePortlet.ElementUid;
                                            }
                                            if (groupExecutor == true && LinePortlet.Service_GroupTask == true)
                                            {
                                                LinePortlet.TaskTEMP = LinePortlet.TaskStr;
                                            }
                                        }
                                    //}
                                }
                                if (LinePortlet.Service_Show == true)
                                {
                                    string taskurl_3 = UrlExtensions.Entity(Url, LinePortlet.TypeUid, LinePortlet.TaskId.ToString());
                                    LinePortlet.TaskStr = new HtmlString(String.Format("<a href=\"{0}\" target=\"_blank\">{1}</a>", taskurl_3, LinePortlet.TaskSubject));

                                    if (LinePortlet.DAT_Task != null)
                                    {
                                        if (LinePortlet.Doc_TypeUid != null && string.IsNullOrWhiteSpace(LinePortlet.Doc_TypeUid))
                                        {
                                            var Doctypeuid = new Guid(LinePortlet.Doc_TypeUid);
                                            string taskurlApp = UrlExtensions.Entity(Url, Doctypeuid, LinePortlet.Doc);
                                            LinePortlet.Docflow = new HtmlString(String.Format("<a href=\"{0}\" target=\"_blank\">Approval</a>", taskurlApp + "?selectedTab=Approvement"));
                                        }
                                    }

                                    var diagramassigntostart = DateTime.Now;
                                    [Deleted].Diagrams.Diagram diagram = null;


                                    if (LinePortlet.Wfb_ID != null)//В конец
                                    {
                                        var inst = PublicAPI.Processes.WorkflowInstance.LoadOrNull(LinePortlet.InstanceId);
                                        diagram = inst.Process.Diagram;
                                        if (diagram != null)
                                        {
                                            var elemuid = new Guid(LinePortlet.ElementUid);
                                            var element = diagram.Elements.FirstOrDefault(x => x.Uid == elemuid);
                                            if (element != null)
                                            {
                                                var taskelement = element as [Deleted].Documents.BPMN.Diagrams.Elements.Approvement.ApprovementElement;
                                                if (taskelement != null)
                                                {
                                                    var swimlane = taskelement.GetSwimlane(diagram);
                                                    LinePortlet.AssignedTo = swimlane.Name;
                                                    var assigndiagexectime = DateTime.Now - diagramassigntostart;
                                                }
                                                else
                                                {
                                                    var usertaskelement = element as [Deleted].Workflow.BPMN.Diagrams.Elements.Tasks.TaskElement;
                                                    if (usertaskelement != null)
                                                    {
                                                        var swimlane = usertaskelement.GetSwimlane(diagram);
                                                        LinePortlet.AssignedTo = swimlane.Name;
                                                        var assigndiagexectime = DateTime.Now - diagramassigntostart;
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    if (!string.IsNullOrWhiteSpace(LinePortlet.UsingTemplate_str))
                                    {
                                        if (LinePortlet.UsingTemplate_str == "1")
                                        {
                                            LinePortlet.UsingTemplate = EnumHelper.GetDisplayName(ConfigurationModel.[Deleted]_UsingTemplate.Standart);
                                        }
                                        if (LinePortlet.UsingTemplate_str == "2")
                                        {
                                            LinePortlet.UsingTemplate = EnumHelper.GetDisplayName(ConfigurationModel.[Deleted]_UsingTemplate.NonStandart[Deleted]);
                                        }
                                        if (LinePortlet.UsingTemplate_str == "3")
                                        {
                                            LinePortlet.UsingTemplate = EnumHelper.GetDisplayName(ConfigurationModel.[Deleted]_UsingTemplate.NonStandart);
                                        }
                                        if (LinePortlet.UsingTemplate_str == "4")
                                        {
                                            LinePortlet.UsingTemplate = EnumHelper.GetDisplayName(ConfigurationModel.[Deleted]_UsingTemplate.UserAttached[Deleted]);
                                        }
                                    }
                                    if (LinePortlet.Comment != null)
                                    {
                                        LinePortlet.Comment = LinePortlet.Comment;
                                    }

                                }

                            }
                            
                            if (LinePortlet.Service_GroupTask == false && LinePortlet.Service_Show == true)
                            {
                                LinePortlet.Save();
                                portlet.Context.MyTasks.Add(LinePortlet);
                                
                            }
                            else
                            if (LinePortlet.Service_GroupTask == true && LinePortlet.Service_Show == true)
                            {
                                portlet.Context.Log += "task #: " + LinePortlet.TaskId.ToString() + " goes to GROUP" + "\n";
                                var linePortletGroup = new Portlets.TasksDebug.Content_GroupTasks();
                                linePortletGroup.ApprovalStatusName = LinePortlet.ApprovalStatusName;
                                linePortletGroup.AssignedTo = LinePortlet.AssignedTo;
                                linePortletGroup.CreatedBy = LinePortlet.CreatedBy;
                                linePortletGroup.DocID = LinePortlet.Doc;
                                linePortletGroup.Docflow = LinePortlet.Docflow;
                                if (LinePortlet.DueDate != null)
                                {
                                    linePortletGroup.DueDate = LinePortlet.DueDate;
                                }

                                if (LinePortlet.EndDate2 != null)
                                {
                                    linePortletGroup.DueDate = DateTime.Parse(LinePortlet.EndDate2);
                                }

                                linePortletGroup.EngagementManager = LinePortlet.EngagementManager;
                                linePortletGroup.EngagementPartner = LinePortlet.EngagementPartner;

                                if (LinePortlet.CurrentUserId != null)
                                {
                                	portlet.Context.Log += "CurrentUserId == " + LinePortlet.CurrentUserId.ToString() + "  " + "\n" + "\n";
                                	var currentUser = EntityManager<User>.Instance.LoadOrNull(LinePortlet.CurrentUserId);
                                    if (currentUser != null)
                                    {
                                        if (currentUser.Id != executorID && LinePortlet.ParentList == null && LinePortlet.DAT_Task != "null")
                                        {
                                            portlet.Context.Log += "currentUser == " + currentUser.FullName.ToString() + "  " + "\n" + "\n";
                                            linePortletGroup.Executor = currentUser;
                                        }

                                    }
                                }

                                if (LinePortlet.CA_FullNameEng != null)
                                {
                                    linePortletGroup.CA_FullNameEng = LinePortlet.CA_FullNameEng;
                                }
                                if (LinePortlet.ExecutFullName != null)
                                {
                                    linePortletGroup.ExecutFullName = LinePortlet.ExecutFullName;
                                }
                                linePortletGroup.UsingTemplate = LinePortlet.UsingTemplate;
                                linePortletGroup.Comment = LinePortlet.Comment;
                                linePortletGroup.Task = LinePortlet.Task;
                                linePortletGroup.TaskId = LinePortlet.TaskId;
                                linePortletGroup.TaskStr = LinePortlet.TaskStr;

                                linePortletGroup.Save();
                                portlet.Context.GroupTasks.Add(linePortletGroup);

                            }
                            else
                            {

                            }
                        }
                    }
                    catch (SqlException ex)
                    {
                        Logger.Log.Error(ex.ToString());
                    }
                }
            }
  
            #endregion
            
            var workTime2 = DateTime.Now;
			var wt3 = (workTime2 - workTime).TotalSeconds.ToString();
			portlet.Context.Log += "wt3: " + wt3 + "\n" + "\n";
        }
        
    }
}





