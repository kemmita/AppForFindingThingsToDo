using Application;
using Application.Comments;
using AutoMapper;
using Domain;
using System.Linq;
using static Application.Activities.ActivitiesList;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(x => x.AppUser.UserName))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(x => x.AppUser.DisplayName))
                .ForMember(dest => dest.IsHost, opt => opt.MapFrom(x => x.IsHost))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(x => x.AppUser.Photos.FirstOrDefault(p => p.IsMainPhoto == true).Url))
                .ForMember(dest => dest.Following, opt => opt.MapFrom<FollowingResolver>());
        }
    }
}
