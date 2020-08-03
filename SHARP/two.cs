using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using [Deleted].Model.Common;
using [Deleted].Model.Entities;
using [Deleted].Model.Managers;
using [Deleted].Model.Types.Settings;
using [Deleted].UI.Controllers;
using [Deleted].UI.Models;
using [Deleted].API;
using [Deleted].UI.Results;
using [Deleted].Common.Models.API;
using Newtonsoft.Json;
using [Deleted].Serialization;
using System.Text.RegularExpressions;
using [Deleted].Runtime.Managers;
using [Deleted].Services;
using [Deleted].Tasks.Models;
using [Deleted].BPM.Web.Security.Extensions;
using [Deleted].Web.Mvc;
using System.Web.Mvc;
using [Deleted].Web.Mvc.Extensions;
using [Deleted].Security.Models;
using [Deleted].Logging;
using Newtonsoft.Json.Linq;
using System.Web.Routing;
using [Deleted].Web.Mvc.ExtensionPoints;
using [Deleted].Model.Services;
using [Deleted].Tasks.Managers;
using [Deleted].BPM.Web.Tasks;
using [Deleted].BPM.Web.Tasks.Extensions;
using System.IO;
using [Deleted].BPM.Web.Tasks.Models;
using [Deleted].Security.Managers;

namespace [Deleted].UI.Pages
{
    /// <summary>
    /// Контроллер страницы "B board"
    /// </summary>
    /// 
    public partial class BBoardController : PageController<BBoard.Index>
    {

        TaskWorkflowActions taskActions = new TaskWorkflowActions();
        string BKey;

        private class FakeController : Controller
        {
            [HttpGet]
            public ActionResult Action()
            {
                return new EmptyResult();
            }
        }



        /// <summary>
        /// Загрузка страницы
        /// </summary>
        public override void Index_Load(PageLoadViewModel<BBoard.Index> page)
        {
            string par = System.Web.HttpContext.Current.Request.Params.Get("BoardKey");
            if (!String.IsNullOrWhiteSpace(par))
            {
                page.Context.Urlonboard = par;
            }
            Load(page);
            GetBoard(page);
            
        }

        /// <summary>
        /// FilterApply
        /// </summary>
        /// <param name="page"></param>
        public virtual ICollection<TaskBase> FilterApply(PageViewModel<BBoard.Index> page)
        {
            TaskBaseFilter taskFilter = new TaskBaseFilter();
            taskFilter.SkipAdminPermission = true;

            if (page.Context.Creators != null) 
            {
                taskFilter.CreationAuthors.AddAll(page.Context.Creators);
            }
            if (page.Context.Executors != null) 
            {
                taskFilter.Executors.AddAll(page.Context.Executors);
            }
            if (page.Context.ProcessHeader != null) //  || page.Context.TaskStatus != null)
            {
                taskFilter.ProcessHeaderId = page.Context.ProcessHeader.Id;
            }
            if (page.Context.Project != null)
            {
                taskFilter.Project = page.Context.Project;
            }

            if (page.Context.TaskName != null)
            {
                taskFilter.Subject = page.Context.TaskName;
            }
            if (page.Context.TaskStatus != null)
            {
                taskFilter.Status = page.Context.TaskStatus;
            }

            var Tasks = EntityManager<TaskBase>.Instance.Find(taskFilter, null);
            return Tasks;
        }

        public virtual UrlHelper UrlInit()
        {
            var controllerContext = ControllerContextCreator.Create(new FakeController());
            var CC = controllerContext.RequestContext;
            var Url = new System.Web.Mvc.UrlHelper(CC);
            return Url;
        }



        public virtual void GetBoard(PageViewModel<BBoard.Index> page)
        {
            Logger.Log.Error("BBoard_log Config_Block count: " + page.Context.Config.Count().ToString());
            var user = PublicAPI.Portal.Security.User.GetCurrentUser();
            var tasks = FilterApply(page);


            var Url = UrlInit();

            string js_style = "";
            string js_insert = "";

            string PriorityClass = "";
            const string quote = "\"";
            TaskCategory Category = null;
            string Name = "";
            string Executor_Html = "";
            string EndDate_Html = "";
            string Subject_Html = "";
            TaskCategory TaskCategory = null;
            TaskCategory TaskCategory_ = null;

            List<TaskCategory> categoryList = new List<TaskCategory>();

            if (page.Context.Config != null)
            {


                foreach (var item in page.Context.Config)
                {
                    if (item.Category != null)
                    {
                        categoryList.Add(item.Category);
                    }

                }

                var isUnsort = tasks.Any(x => !categoryList.Contains(x.Category));
                if (isUnsort == true)
                {
                    string unTaskItems = "[";

                    var unsorted = tasks.Where(x => !categoryList.Contains(x.Category));

                    foreach (var untask in unsorted)
                    {
                        string userPhoto = "";
                        string User_Url = "";

                        var Task_Url = UrlExtensions.Entity(Url, untask);

                        if (untask.Executor != null)
                        {
                            Executor_Html = untask.Executor.FullName;
                            User_Url = UrlExtensions.Entity(Url, untask.Executor);
                            userPhoto = UserWebExtensions.UserPhotoUrl(Url, untask.Executor, 12);
                        }

                        EndDate_Html = untask.EndDate.ToString();

                        if (untask.Subject != null)
                        {
                            Subject_Html = untask.Subject.ToString();
                        }

                        if (untask.Priority == PublicAPI.Enums.Tasks.TaskPriority.Low)
                        {
                            PriorityClass = "phui-oi-actions-low";
                        }
                        if (untask.Priority == PublicAPI.Enums.Tasks.TaskPriority.Medium)
                        {
                            PriorityClass = "phui-oi-actions-mid";
                        }
                        if (untask.Priority == PublicAPI.Enums.Tasks.TaskPriority.High)
                        {
                            PriorityClass = "phui-oi-actions-hig";
                        }

                        var tempTask_Html_ = "{\"id\": \"" + untask.Id.ToString() + "\",\"title\": \"" + "<div class=\'phui-oi-frame\'><div class=\'phui-oi-frame-content\'><div class=\'phui-oi-actions\'><div class=\'" + PriorityClass + "\'></div></div><div class=\'phui-oi-content-box\'><div class=\'phui-oi-grip\'></div><div class=\'phui-oi-table\'><div class=\'phui-oi-table-row\'><div class=\'phui-oi-col1\'><div class=\'phui-oi-name\'><span data-sigil=\'slippery\'><span class=\'phui-oi-objname\'>" + untask.Id.ToString() + "</span> <a href=\'" + Task_Url + "\' class=\'phui-oi-link\' title=\'Help\' target=\'_blank\'>" + Subject_Html + "</a></span></div><div class=\'phui-oi-content\'><div class=\'phui-oi-attributes\'><div class=\'phui-oi-attribute\' style=\'\'><a class=\'phui-tag-view phui-tag-type-object phui-tag-shade phui-tag-shade-red phui-tag-shade-slim phui-tag-icon-view \' href=\'" + User_Url + "\' target=\'_blank\' style=\'padding-bottom: 0px;\'><span class=\'phui-tag-core \'>" + Executor_Html + "</span></a></div><div class=\'phui-oi-handle-icons\'><span class=\'phui-oi-handle-icon\' style=\'background-image: url(" + userPhoto + ");\' data-sigil=\'has-tooltip\' data-meta=\'0_12\'></span></div></div></div></div></div></div></div></div></div>" + "\",}, ";
                        unTaskItems += tempTask_Html_;

                    }
                    unTaskItems += "]";

                    string js_insert_ = "";
                    string js_style_ = "";

                    var tempCategory = "1804f008-bb00-400e-a007-0a462582b1e1";
                    var temp_classname = "Unsorted";
                    var tmp_Name = "Unsorted";

                    js_style_ = ".Unsorted { background: #00b8d4;}";
                    js_insert_ += " BTest.addBoards([{\"id\": \"" + tempCategory + "\",\"title\":" + quote + tmp_Name + quote + ",\"class\":" + quote + temp_classname + quote + ",\"item\": " + unTaskItems + " }] ) ";

                    page.Context.Js_insert_ = js_insert_;
                    page.Context.Js_style_ = js_style_;

                }



                foreach (var column in page.Context.Config)
                {
                    string TaskItems = "[";

                    #region Name
                    if (!string.IsNullOrWhiteSpace(column.Name))
                    {
                        Name = column.Name;
                    }
                    #endregion

                    #region classname & js_style
                    string classname = Name.Replace(" ", string.Empty) + column.Numbering.ToString();
                    js_style += "." + classname + " {background: " + column.Color.ColorCode + ";}\n";
                    #endregion

                    #region Category euquals
                    var taskpull = tasks.Where(x => x.Category == column.Category);
                    foreach (var task in taskpull)
                    {
                        string userPhoto = "";
                        string User_Url = "";

                        var Task_Url = UrlExtensions.Entity(Url, task);

                        if (task.Executor != null)
                        {
                            Executor_Html = task.Executor.FullName;
                            User_Url = UrlExtensions.Entity(Url, task.Executor);
                            userPhoto = UserWebExtensions.UserPhotoUrl(Url, task.Executor, 12);
                        }

                        EndDate_Html = task.EndDate.ToString();

                        if (task.Subject != null)
                        {
                            Subject_Html = task.Subject.ToString();
                        }

                        if (task.Priority == PublicAPI.Enums.Tasks.TaskPriority.Low)
                        {
                            PriorityClass = "phui-oi-actions-low";
                        }
                        if (task.Priority == PublicAPI.Enums.Tasks.TaskPriority.Medium)
                        {
                            PriorityClass = "phui-oi-actions-mid";
                        }
                        if (task.Priority == PublicAPI.Enums.Tasks.TaskPriority.High)
                        {
                            PriorityClass = "phui-oi-actions-hig";
                        }

                        page.Context.Task = task;

                        if (task.Status != null && task.CreationAuthor != null)
                        {
                            var TaskViewModel_ = new [Deleted].BPM.Web.Tasks.Models.TaskViewModel
                            {
                                Entity = task,
                                IsAvailableEdit = taskActions.IsAvailableEdit(task, user),
                                IsAvailableControlledAction = task.Status == TaskStatus.WasClosed && (task.CreationAuthor == user || UserManager.Instance.IsSubordinateUser(user, task.CreationAuthor)),
                                IsAvailableClose = taskActions.IsAvailableClose(task, user),
                                IsAvailableDeleteWatches = taskActions.IsAvailableDeleteWatches(task, user),
                            };
                            page.Context.TaskViewModel = TaskViewModel_;
                        }

                        var tempTask_Html = "{\"id\": \"" + task.Id.ToString() + "\",\"title\": \"" + "<div class=\'phui-oi-frame\'><div class=\'phui-oi-frame-content\'><div class=\'phui-oi-actions\'><div class=\'" + PriorityClass + "\'></div></div><div class=\'phui-oi-content-box\'><div class=\'phui-oi-grip\'></div><div class=\'phui-oi-table\'><div class=\'phui-oi-table-row\'><div class=\'phui-oi-col1\'><div class=\'phui-reassing\' style=\'float: right;\'><a href=\'javascript:comment();\' ><img src=\'/Content/Images/x16/redirect_poruch.png\' title=\'Переназначить\'></a></div><div class=\'phui-oi-name\'><span data-sigil=\'slippery\'><span class=\'phui-oi-objname\'>" + task.Id.ToString() + "</span> <a href=\'" + Task_Url + "\' class=\'phui-oi-link\' title=\'Help\' target=\'_blank\'>" + Subject_Html + "</a></span></div><div class=\'phui-oi-content\'><div class=\'phui-oi-attributes\'><div class=\'phui-oi-attribute\' style=\'\'><a class=\'phui-tag-view phui-tag-type-object phui-tag-shade phui-tag-shade-red phui-tag-shade-slim phui-tag-icon-view \' href=\'" + User_Url + "\' target=\'_blank\' style=\'padding-bottom: 0px;\'><span class=\'phui-tag-core \'>" + Executor_Html + "</span></a></div><div class=\'phui-oi-handle-icons\'><span class=\'phui-oi-handle-icon\' style=\'background-image: url(" + userPhoto + ");\' data-sigil=\'has-tooltip\' data-meta=\'0_12\'></span></div></div></div></div></div></div></div></div></div>" + "\",}, ";
                        TaskItems += tempTask_Html;


                    }
                    #endregion

                    TaskItems += "]";

                    js_insert += " BTest.addBoards([{\"id\": \"" + column.Uid + "\",\"title\":" + quote + Name + quote + ",\"class\":" + quote + classname + quote + ",\"item\": " + TaskItems + " }] ) ";
                    js_insert += "\n";

                }

                page.Context.Js_insert = js_insert;
                page.Context.Js_style = js_style;

                page.Context.Debug2 += js_insert + "\n" + js_style;

            }


        }



        private void removeFields(JToken token, string[] fields)
        {
            JContainer container = token as JContainer;
            if (container == null) return;

            List<JToken> removeList = new List<JToken>();
            foreach (JToken el in container.Children())
            {
                JProperty p = el as JProperty;
                if (p != null && fields.Contains(p.Name))
                {
                    removeList.Add(el);
                }
                removeFields(el, fields);
            }

            foreach (JToken el in removeList)
            {
                el.Remove();
            }
        }


        /// <summary>
        /// Save
        /// </summary>
        /// <param name="page"></param>
        public virtual void Save(PageViewModel<BBoard.Index> page)
        {

            if (string.IsNullOrWhiteSpace(page.Context.Urlonboard))
            {
                Guid g = Guid.NewGuid();
                string GuidString = Convert.ToBase64String(g.ToByteArray());
                GuidString = GuidString.Replace("=", "");
                GuidString = GuidString.Replace("+", "");
                GuidString = GuidString.Replace("'\'", "");
                page.Context.Urlonboard = GuidString;

            }

            string generalString = "";
            var js = new EntityJsonSerializer();
            var raw_string = js.Serialize(page.Context);

            dynamic JSobj = JObject.Parse(raw_string);
            JSobj.Remove("TypeUid");
            string s = JSobj.ToString();
            var jar = (JSobj.Config as JArray);
            removeFields(jar, new string[] { "Parent" });
            string final_string = JSobj.ToString(Formatting.None);
            generalString += final_string + "\n";
            page.Context.Debug = generalString;

            var blobStore = Locator.GetServiceNotNull<IBLOBStore>();
            blobStore.Remove(String.Format(page.Context.Urlonboard));    

            blobStore.Save(String.Format(page.Context.Urlonboard), ClassSerializationHelper.SerializeObject(generalString));
            var basesettings = Locator.GetService<[Deleted].Runtime.Settings.CommonSettingsModule>();
            string baseURL = basesettings.Settings.ApplicationBaseUrl;

            string boardUrl = baseURL + "/UI/Page/BBoard?BoardKey=" + page.Context.Urlonboard;
            page.Context.ContextString = boardUrl;

        }

        /// <summary>
        /// Load
        /// </summary>
        /// <param name="page"></param>
        public virtual void Load(PageViewModel<BBoard.Index> page)
        {
            if (!string.IsNullOrWhiteSpace(page.Context.Debug))
            {
                var rawjson = page.Context.Debug;

                var prestring = rawjson.Split(new string[] {
                    "\n"
                }, StringSplitOptions.RemoveEmptyEntries).ToList();

                Regex.Split(rawjson, "\n").ToList();
                page.Context.Debug = prestring.FirstOrDefault();

                foreach (var elem in prestring)
                {
                    var Block_item = new UI.Pages.BBoard.Index_Config();
                    var js = new EntityJsonSerializer();
                    var webdata = new WebData();
                    var desjs = js.Deserialize(elem.Trim(), typeof(UI.Pages.BBoard.Index_Config));

                    Block_item = (UI.Pages.BBoard.Index_Config)desjs;
                    Block_item.Save();
                    page.Context.Config.Add(Block_item);
                }

            }
            if (!string.IsNullOrWhiteSpace(page.Context.Urlonboard))
            {
                BKey = page.Context.Urlonboard;
                var user = PublicAPI.Portal.Security.User.GetCurrentUser();
                var blobStore = Locator.GetServiceNotNull<IBLOBStore>();

                var blob = blobStore.LoadOrNull(String.Format(page.Context.Urlonboard));

                var BString = ClassSerializationHelper.DeserializeObject(blob) as String;

                Deserialize(BString, page);
            }
        }


        public virtual void Deserialize(string A, PageViewModel<BBoard.Index> page)
        {
            page.Context.Config.Clear();
            var jsonSerializer = new EntityJsonSerializer();
            jsonSerializer.Deserialize(A, page.Context, true);
        }

        /// <summary>
        /// Apply
        /// </summary>
        /// <param name="page"></param>
        public virtual void Apply(PageViewModel<BBoard.Index> page)
        {
            page.RedirectToPage(String.Format("BBoard?BoardKey={0}", page.Context.Urlonboard));
        }

        public virtual void SyncCategory(PageViewModel<BBoard.Index> page)  //add some task chng\status chng, process run.
        {

            if (!string.IsNullOrWhiteSpace(page.Context.ContextString))
            {
                var dict = new Dictionary<string, string>();
                var strings = page.Context.ContextString.Split(';');
                dict.Add("From", strings[0]);
                dict.Add("To", strings[1]);
                var taskID = long.Parse(dict["From"].Split(':')[0]);

                Logger.Log.Error("stringConfig UID" + dict["To"].Split(':')[1].ToString());

                var stringConfig = page.Context.Config.Where(x => x.Uid == (new Guid(dict["To"].Split(':')[1]))).FirstOrDefault();
                Logger.Log.Error("stringConfig " + stringConfig.Name);

                var task = EntityManager<TaskBase>.Instance.LoadOrNull(taskID);
                task.Category = stringConfig.Category;

                if (stringConfig.StatusChange != null)
                {
                    if (stringConfig.StatusChange == PublicAPI.Enums.Tasks.TaskBaseStatus.Complete)             //Complete
                    {
                        CompleteTaskModel ctm = new CompleteTaskModel();
                        [Deleted].Tasks.Managers.TaskBaseManager.Instance.CompleteTask(task.Id, ctm);
                    }
                    if (stringConfig.StatusChange == PublicAPI.Enums.Tasks.TaskBaseStatus.InProgress)               //InProgress
                    {
                        [Deleted].Tasks.Managers.TaskBaseManager.Instance.StartWork(task.Id, true, null);
                    }

                    if (stringConfig.StatusChange == PublicAPI.Enums.Tasks.TaskBaseStatus.WasClosed)                //WasClosed
                    {
                        [Deleted].Tasks.Managers.TaskBaseManager.Instance.Terminate(task, false);
                    }
                    if (stringConfig.StatusChange == PublicAPI.Enums.Tasks.TaskBaseStatus.Read)                     //Read
                    {
                        task.Status = PublicAPI.Enums.Tasks.TaskBaseStatus.Read;
                    }

                    if (stringConfig.StatusChange == PublicAPI.Enums.Tasks.TaskBaseStatus.OnApprovalExecutor)            //OnApprovalExecutor
                    {
                        task.Status = PublicAPI.Enums.Tasks.TaskBaseStatus.OnApprovalExecutor;
                    }
                }
                task.Save();


                if (stringConfig.RunProcess != null)
                {
                        if (stringConfig.RunProcess != null)
                        {
                            Action<dynamic> processcontext = mycontext => 
                            {
                                mycontext.Iniciator = PublicAPI.Portal.Security.User.GetCurrentUser(); 
                            };

                            var instance = PublicAPI.Processes.WorkflowInstance.StartProcess(stringConfig.RunProcess.Published, "processs_header", processcontext);
                        }
                }

            }






        }



    }
}
