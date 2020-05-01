using Application.Interfaces;
using Application.User;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    public class FacebookAccessor : IFacebookAccessor
    {
        private readonly HttpClient _httpClient;

        private readonly IOptions<FacebookAppSettings> _config;
        public FacebookAccessor(IOptions<FacebookAppSettings> config)
        {
            _config = config;

            _httpClient = new HttpClient
            {
                BaseAddress = new System.Uri("https://graph.facebook.com/")
            };

            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<FacebookUserInfo> FacebookLogin(string accessToken)
        {
            // verify token is valid using facebook
            var verifiedToen = await _httpClient.GetAsync($"debug_token?input_token={accessToken}&access_token={_config.Value.AppId}|{_config.Value.AppSecret}");

            if (!verifiedToen.IsSuccessStatusCode)
                return null;

            return await GetAsync<FacebookUserInfo>(accessToken, "me", "fields=name,email,picture.width(100).height(100)");
        }

        private async Task<T> GetAsync<T>(string accessToken, string endpoint, string args)
        {
            // Go and get users infor from facebook 
            var response = await _httpClient.GetAsync($"{endpoint}?access_token={accessToken}&{args}");

            if (!response.IsSuccessStatusCode)
                return default(T);

            var result = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<T>(result);
        }
    }
}
