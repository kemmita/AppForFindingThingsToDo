using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User
{
    public class CreateRole
    {
        public class Command : IRequest
        {
            public string RoleName { get; set; }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly ApplicationDbContext _db;
            private readonly UserManager<AppUser> _userManager;
            private readonly RoleManager<AppUser> _roleManager;
            public Handler(ApplicationDbContext db, UserManager<AppUser> userManager, RoleManager<AppUser> roleManager)
            {
                _db = db;
                _userManager = userManager;
                _roleManager = roleManager;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                return Unit.Value;
            }
        }
    }
}
