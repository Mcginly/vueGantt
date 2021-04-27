using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WASD.WASD.API;
using WASD.WASD.Model.Common;
using WASD.WASD.Model.Entities;
using WASD.WASD.Model.Managers;
using WASD.WASD.Model.Types.Settings;
using WASD.WASD.Model.Entities.ProcessContext;
using Context = WASD.WASD.Model.Entities.ProcessContext.P_CalendarEvents;
using WASD.WASD.Security.Models;
using WASD.WASD.Calendar.Managers;
using WASD.WASD.CRM.Models;
using WASD.WASD.Model.Ranges;
using WASD.WASD.Calendar.Models;

namespace WASD.WASD.Model.Scripts
{
    public partial class P_CalendarEvents_Scripts : WASD.WASD.Workflow.Scripts.ProcessScriptBase<Context>
    {
        public virtual void A1(Context context)
        {
            string log = "";

            var procStart = context.WorkflowInstance.StartDate.Value.DayOfYear;
            var procEnd = context.WorkflowInstance.StartDate.Value.DayOfYear + 30;
            var poolCL = PublicAPI.CRM.Contractor.ContractorLegal.Filter().Find().Where(c => c.EventsNotify == true);
            if (poolCL != null)
            {
                foreach (var contractorLegal in poolCL)
                {
                    if (contractorLegal != null)
                    {
                        List<User> uList = new List<User>();
                        uList.Add(contractorLegal.UpdateResponsible);

                        #region RemainCompanyDay
                        if (contractorLegal.RemainCompanyDay && contractorLegal.CompanyDay != null)
                        {
                            if ((contractorLegal.CompanyDay.Value.DayOfYear > procStart) & (contractorLegal.CompanyDay.Value.DayOfYear < (procEnd)))
                            {
                                var yearTemp = DateTime.Today.Year - contractorLegal.CompanyDay.Value.Year;
                                var date = contractorLegal.CompanyDay.Value;
                                var startEventDate = date.AddYears(yearTemp);
                                var endEventDate = startEventDate.AddHours(18);

                                string eventSubject = String.Format("Поздравить с праздником");
                                string eventDescription = String.Format("Поздравить с праздником: День компании");

                                #region CompareAndDelete
                                DateTimeRange range = new DateTimeRange();
                                range.From = startEventDate;
                                range.To = endEventDate;

                                Schedule op = new Schedule();
                                string uName = uList.FirstOrDefault().FullName;
                                PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => op = PublicAPI.Portal.Objects.Calendar.Schedule.Filter().Name(uName).Find().FirstOrDefault()); 
                                if (op != null)
                                {
                                    CalendarEvent qwez = new CalendarEvent();
                                    PublicAPI.Services.Security.RunByUser(uList.FirstOrDefault(), () => qwez = PublicAPI.Portal.CalendarEvent.Filter().Schedules(op).Subject(eventSubject).DateRange(range).Find().FirstOrDefault());
                                    if (qwez != null)
                                    {
                                        if (qwez.Completed == false)
                                        {
                                            PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => PublicAPI.Portal.CalendarEvent.Delete(qwez));
                                        }
                                    }
                                }
                                #endregion

                                var calEvent = PublicAPI.Portal.CalendarEvent.Create(uList, startEventDate, endEventDate, eventSubject, "-", eventDescription);
                                calEvent.Contractor = contractorLegal;
                                calEvent.Save();

                                var reminderDate = startEventDate.AddDays(-30);
                                var userr = uList.FirstOrDefault();
                                var aqw = PublicAPI.Portal.CalendarEvent.CreateReminder(userr, calEvent, reminderDate);
                            }
                        }
                        #endregion

                        #region HolidaysForCongratulations
                        if (contractorLegal.HolidaysForCongratulations.Count > 0)
                        {
                            var holidays = contractorLegal.HolidaysForCongratulations;
                            foreach (var hol in holidays)
                            {
                                int yearTemp;
                                DateTime date;
                                DateTime startEventDate;
                                DateTime endEventDate;

                                if (hol.Date != null && !String.Equals(hol.Name, "День отрасли"))
                                {
                                    if ((hol.Date.Value.DayOfYear > procStart) & (hol.Date.Value.DayOfYear < (procEnd)))
                                    {
                                        yearTemp = DateTime.Today.Year - hol.Date.Value.Year;
                                        date = hol.Date.Value;
                                        startEventDate = date.AddYears(yearTemp);
                                        endEventDate = startEventDate.AddHours(18);

                                        var eventSubject = "Поздравить с праздником";
                                        string eventDescription = String.Format("Поздравить с праздником: " + hol.Name + "\n" + contractorLegal.Name);

                                        #region CompareAndDelete
                                        DateTimeRange range = new DateTimeRange();
                                        range.From = startEventDate;
                                        range.To = endEventDate;

                                        Schedule op = new Schedule();
                                        string uName = uList.FirstOrDefault().FullName;
                                        PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => op = PublicAPI.Portal.Objects.Calendar.Schedule.Filter().Name(uName).Find().FirstOrDefault()); 

                                        if (op != null)
                                        {
                                            CalendarEvent qwez = new CalendarEvent();
                                            PublicAPI.Services.Security.RunByUser(uList.FirstOrDefault(), () => qwez = PublicAPI.Portal.CalendarEvent.Filter().Schedules(op).Subject(eventSubject).DateRange(range).Find().FirstOrDefault());

                                            if (qwez != null)
                                            {
                                                if (qwez.Completed == false)
                                                {
                                                    PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => PublicAPI.Portal.CalendarEvent.Delete(qwez));
                                                }
                                            }
                                        }

                                        #endregion

                                        var calEvent = PublicAPI.Portal.CalendarEvent.Create(uList, startEventDate, endEventDate, eventSubject, "-", eventDescription);
                                        calEvent.Contractor = contractorLegal;
                                        calEvent.Event = hol;
                                        calEvent.Save();
                                        var reminderDate = startEventDate.AddDays(-30);
                                        var userr = uList.FirstOrDefault();
                                        var aqw = PublicAPI.Portal.CalendarEvent.CreateReminder(userr, calEvent, reminderDate);
                                    }
                                }
                                else
                                {
                                    if (contractorLegal.Industry != null && contractorLegal.Industry.IndustryDay != null)
                                    {
                                        if ((contractorLegal.Industry.IndustryDay.Value.DayOfYear > procStart) & (contractorLegal.Industry.IndustryDay.Value.DayOfYear < (procEnd)))
                                        {
                                            var industryDay = contractorLegal.Industry.IndustryDay.Value;
                                            yearTemp = DateTime.Today.Year - industryDay.Year;
                                            date = industryDay;
                                            startEventDate = date.AddYears(yearTemp);
                                            endEventDate = startEventDate.AddHours(18);

                                            var eventSubject = "Поздравить с праздником";
                                            string eventDescription = String.Format("Поздравить с праздником: " + hol.Name + "\n" + contractorLegal.Name);

                                            #region CompareAndDelete
                                            DateTimeRange range = new DateTimeRange();
                                            range.From = startEventDate;
                                            range.To = endEventDate;

                                            Schedule op = new Schedule();
                                            string uName = uList.FirstOrDefault().FullName;
                                            PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => op = PublicAPI.Portal.Objects.Calendar.Schedule.Filter().Name(uName).Find().FirstOrDefault());
                                            
                                            if (op != null)
                                            {
                                                CalendarEvent qwez = new CalendarEvent();
                                                PublicAPI.Services.Security.RunByUser(uList.FirstOrDefault(), () => qwez = PublicAPI.Portal.CalendarEvent.Filter().Schedules(op).Subject(eventSubject).DateRange(range).Find().FirstOrDefault());
                                                if (qwez != null)
                                                {
                                                    if (qwez.Completed == false)
                                                    {
                                                        PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => PublicAPI.Portal.CalendarEvent.Delete(qwez));
                                                    }
                                                }
                                            }

                                            #endregion

                                            var calEvent = PublicAPI.Portal.CalendarEvent.Create(uList, startEventDate, endEventDate, eventSubject, "-", eventDescription);
                                            calEvent.Contractor = contractorLegal;
                                            calEvent.Event = hol;
                                            calEvent.Save();

                                            var reminderDate = startEventDate.AddDays(-30);
                                            var userr = uList.FirstOrDefault();
                                            var aqw = PublicAPI.Portal.CalendarEvent.CreateReminder(userr, calEvent, reminderDate);
                                        }
                                    }
                                }
                            }
                        }
                        #endregion
                        
                        var notifyContacts = contractorLegal.Contacts.Where(c => c.RemainOnBirthDay = true || c.HolidaysForCongratulations != null);

                        #region work with contacts
                        if (notifyContacts.Count() > 0)
                        {
                            foreach (var contact in notifyContacts)
                            {
                                #region contacts birthdays
                                if (contact.Birthday != null)
                                {
                                    if ((contact.Birthday.Value.DayOfYear > procStart) & (contact.Birthday.Value.DayOfYear < (procEnd)))
                                    {
                                        var birthday = contact.Birthday.Value;

                                        var yearTemp = DateTime.Today.Year - birthday.Year;
                                        var date = birthday;
                                        var startEventDate = date.AddYears(yearTemp);
                                        var endEventDate = startEventDate.AddHours(18);

                                        string eventSubject = String.Format("Поздравить с днём рождения");
                                        string eventDescription = String.Format(" ");

                                        #region CompareAndDelete

                                        DateTimeRange range = new DateTimeRange();
                                        range.From = startEventDate;
                                        range.To = endEventDate;

                                        Schedule op = new Schedule();
                                        string uName = uList.FirstOrDefault().FullName;
                                        PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => op = PublicAPI.Portal.Objects.Calendar.Schedule.Filter().Name(uName).Find().FirstOrDefault());

                                        if (op != null)
                                        {
                                            CalendarEvent qwez = new CalendarEvent();
                                            PublicAPI.Services.Security.RunByUser(uList.FirstOrDefault(), () => qwez = PublicAPI.Portal.CalendarEvent.Filter().Schedules(op).Subject(eventSubject).DateRange(range).Find().FirstOrDefault());    // поиск в календаре дархановой 
                                            if (qwez != null)
                                            {
                                                if (qwez.Completed == false)
                                                {
                                                    PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => PublicAPI.Portal.CalendarEvent.Delete(qwez));
                                                }
                                            }
                                        }

                                        #endregion

                                        var calEvent = PublicAPI.Portal.CalendarEvent.Create(uList, startEventDate, endEventDate, eventSubject, "-", eventDescription);
                                        calEvent.ExternalMembers.Add(contact);

                                        calEvent.Contractor = contractorLegal;
                                        calEvent.Save();

                                        var reminderDate = startEventDate.AddDays(-30);
                                        var userr = uList.FirstOrDefault();
                                        var aqw = PublicAPI.Portal.CalendarEvent.CreateReminder(userr, calEvent, reminderDate);
                                    }

                                }
                                #endregion

                                #region contacts holidays

                                var holidays = contact.HolidaysForCongratulations;

                                foreach (var holiday in holidays)
                                {
                                    int yearTemp;
                                    DateTime date;
                                    DateTime startEventDate;
                                    DateTime endEventDate;

                                    if (holiday.Date != null && !String.Equals(holiday.Name, "День отрасли"))
                                    {
                                        if ((holiday.Date.Value.DayOfYear > procStart) & (holiday.Date.Value.DayOfYear < (procEnd)))
                                        {
                                            yearTemp = DateTime.Today.Year - holiday.Date.Value.Year;
                                            date = holiday.Date.Value;
                                            startEventDate = date.AddYears(yearTemp);
                                            endEventDate = startEventDate.AddHours(18);

                                            var eventSubject = "Поздравить с праздником";
                                            string eventDescription = String.Format("Поздравить с праздником: " + holiday.Name + "\n" + contractorLegal.Name);

                                            #region CompareAndDelete
                                            DateTimeRange range = new DateTimeRange();
                                            range.From = startEventDate;
                                            range.To = endEventDate;

                                            Schedule op = new Schedule();
                                            string uName = uList.FirstOrDefault().FullName;
                                            PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => op = PublicAPI.Portal.Objects.Calendar.Schedule.Filter().Name(uName).Find().FirstOrDefault());

                                            if (op != null)
                                            {
                                                CalendarEvent qwez = new CalendarEvent();
                                                PublicAPI.Services.Security.RunByUser(uList.FirstOrDefault(), () => qwez = PublicAPI.Portal.CalendarEvent.Filter().Schedules(op).Subject(eventSubject).DateRange(range).Find().FirstOrDefault());    // поиск в календаре дархановой 
                                                if (qwez != null)
                                                {
                                                    if (qwez.Completed == false)
                                                    {
                                                        PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => PublicAPI.Portal.CalendarEvent.Delete(qwez));
                                                    }
                                                }
                                            }

                                            #endregion


                                            var calEvent = PublicAPI.Portal.CalendarEvent.Create(uList, startEventDate, endEventDate, eventSubject, "-", eventDescription);
                                            calEvent.Contractor = contractorLegal;
                                            calEvent.ExternalMembers.Add(contact);
                                            calEvent.Event = holiday;
                                            calEvent.Save();

                                            var reminderDate = startEventDate.AddDays(-30);
                                            var userr = uList.FirstOrDefault();
                                            var aqw = PublicAPI.Portal.CalendarEvent.CreateReminder(userr, calEvent, reminderDate);
                                            log += "Contacts holiday: " + eventSubject + "\n";
                                        }
                                    }
                                    else
                                    {
                                        if (holiday.Date != null)
                                        {
                                            if ((holiday.Date.Value.DayOfYear > procStart) & (holiday.Date.Value.DayOfYear < (procEnd)))
                                            {
                                                yearTemp = DateTime.Today.Year - holiday.Date.Value.Year;
                                                date = holiday.Date.Value;
                                                startEventDate = date.AddYears(yearTemp);
                                                endEventDate = startEventDate.AddHours(18);

                                                var eventSubject = "Поздравить с праздником";
                                                string eventDescription = String.Format("Поздравить с праздником: " + holiday.Name + "\n" + contractorLegal.Name);

                                                #region CompareAndDelete

                                                DateTimeRange range = new DateTimeRange();
                                                range.From = startEventDate;
                                                range.To = endEventDate;

                                                Schedule op = new Schedule();
                                                string uName = uList.FirstOrDefault().FullName;
                                                PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => op = PublicAPI.Portal.Objects.Calendar.Schedule.Filter().Name(uName).Find().FirstOrDefault()); 

                                                if (op != null)
                                                {
                                                    CalendarEvent qwez = new CalendarEvent();
                                                    PublicAPI.Services.Security.RunByUser(uList.FirstOrDefault(), () => qwez = PublicAPI.Portal.CalendarEvent.Filter().Schedules(op).Subject(eventSubject).DateRange(range).Find().FirstOrDefault());    // поиск в календаре дархановой 
                                                    if (qwez != null)
                                                    {
                                                        if (qwez.Completed == false)
                                                        {
                                                            PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => PublicAPI.Portal.CalendarEvent.Delete(qwez));
                                                        }
                                                    }
                                                }

                                                #endregion

                                                var calEvent = PublicAPI.Portal.CalendarEvent.Create(uList, startEventDate, endEventDate, eventSubject, "-", eventDescription);
                                                calEvent.Contractor = contractorLegal;
                                                calEvent.ExternalMembers.Add(contact);
                                                calEvent.Event = holiday;
                                                calEvent.Save();

                                                var reminderDate = startEventDate.AddDays(-30);
                                                var userr = uList.FirstOrDefault();
                                                var aqw = PublicAPI.Portal.CalendarEvent.CreateReminder(userr, calEvent, reminderDate);
                                            }
                                        }
                                    }
                                }

                                #endregion
                            }
                        }
                        #endregion
                    }
                }
            }
        }

        public virtual void A0(Context context)
        {
            //находим контрагента
            var contractorLegalw = PublicAPI.CRM.Contractor.ContractorLegal.Filter().Name("Госкорпорация \"Росатом\"").Find().Where(c => c.EventsNotify = true).FirstOrDefault();

            var poolCL = PublicAPI.CRM.Contractor.ContractorLegal.Filter().Find().Where(c => c.EventsNotify == true);

            if (poolCL != null)
            {
                foreach (var contractorLegal in poolCL)
                {
                    if (contractorLegal != null)
                    {
                        List<User> uList = new List<User>();
                        uList.Add(contractorLegal.UpdateResponsible);

                        if (contractorLegal.HolidaysForCongratulations.Count > 0)
                        {
                            var log = "HolidaysForCongratulations+ \n";
                            var holidays = contractorLegal.HolidaysForCongratulations;
                            foreach (var hol in holidays)
                            {
                                int yearTemp;
                                DateTime date;
                                DateTime startEventDate;
                                DateTime endEventDate;

                                if (hol.Date != null && !String.Equals(hol.Name, "День отрасли"))
                                {
                                    yearTemp = DateTime.Today.Year - hol.Date.Value.Year;
                                    date = hol.Date.Value;
                                    startEventDate = date.AddYears(yearTemp);
                                    endEventDate = startEventDate.AddHours(18);

                                    var eventSubject = "Поздравить с праздником";
                                    string eventDescription = String.Format("Поздравить с праздником: " + hol.Name + "\n" + contractorLegal.Name);

                                    #region CompareAndDelete

                                    DateTimeRange range = new DateTimeRange();
                                    range.From = startEventDate;
                                    range.To = endEventDate;

                                    Schedule op = new Schedule();
                                    string uName = uList.FirstOrDefault().FullName;
                                    PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => op = PublicAPI.Portal.Objects.Calendar.Schedule.Filter().Name(uName).Find().FirstOrDefault());
                                    if (op != null)
                                    {
                                        CalendarEvent qwez = new CalendarEvent();
                                        PublicAPI.Services.Security.RunByUser(uList.FirstOrDefault(), () => qwez = PublicAPI.Portal.CalendarEvent.Filter().Schedules(op).Subject(eventSubject).DateRange(range).Find().FirstOrDefault());    // поиск в календаре дархановой 
                                        if (qwez != null)
                                        {
                                            if (qwez.Completed == false)
                                            {
                                                PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => PublicAPI.Portal.CalendarEvent.Delete(qwez));
                                            }
                                        }
                                    }

                                    #endregion

                                    var calEvent = PublicAPI.Portal.CalendarEvent.Create(uList, startEventDate, endEventDate, eventSubject, "-", eventDescription);
                                    calEvent.Contractor = contractorLegal;
                                    calEvent.Event = hol;
                                    calEvent.Save();
                                    var reminderDate = startEventDate.AddDays(-30);
                                    var userr = uList.FirstOrDefault();
                                    var aqw = PublicAPI.Portal.CalendarEvent.CreateReminder(userr, calEvent, reminderDate);
                                    log += "Holiday: " + eventSubject + "\n";
                                }
                            }
                        }
                    }
                }
            }
        }

        public virtual void A2(Context context)
        {
            List<CalendarEvent> all = new List<CalendarEvent>();
            PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => all = PublicAPI.Portal.CalendarEvent.Filter().Find().ToList());
            foreach (var item in all)
            {
                PublicAPI.Services.Security.RunWithElevatedPrivilegies(() => PublicAPI.Portal.CalendarEvent.Delete(item));
            }
        }
    }
}
