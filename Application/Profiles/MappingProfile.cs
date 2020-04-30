using Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Profiles
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<UserActivity, UserActivityDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(x => x.ActivityId))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(x => x.Activity.Category))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(x => x.Activity.Date))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(x => x.Activity.Title));
        }
    }
}
