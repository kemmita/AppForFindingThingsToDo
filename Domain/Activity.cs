using System;
using System.Collections.Generic;
using Newtonsoft.Json;


namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public DateTime Date { get; set; }
        [JsonProperty(PropertyName = "attendees")]
        public virtual ICollection<UserActivity> UserActivities { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
    }
}
