using System;
using System.Collections.Generic;
using System.Text;

namespace Domain
{
    public class UserFollowing
    {
        public string ObserverId { get; set; }
        // Specify virtual so that it becomes a navigation prop
        public virtual AppUser Observer { get; set; }
        public string TargetId { get; set; }
        // Specify virtual so that it becomes a navigation prop
        public virtual AppUser Target { get; set; }
    }
}
