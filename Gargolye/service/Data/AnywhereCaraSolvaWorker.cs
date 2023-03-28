using Anywhere.Data;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Anywhere.service.Data
{
    public class AnywhereCaraSolvaWorker
    {
        DataGetter dg = new DataGetter();
        AnywhereWorker anywhereWorker = new AnywhereWorker();
        public string Main(string anywhereToken)
        {
            string finalURL = "";

            bool isTokenValid = anywhereWorker.ValidateToken(anywhereToken);
            if (isTokenValid)
            {
                SecurityTokenDescriptor securityTokenDescriptor = getSecurityTokenDescriptor(anywhereToken);

                var tokenHandler = new JwtSecurityTokenHandler();
                var plainToken = tokenHandler.CreateToken(securityTokenDescriptor);
                var signedAndEncodedToken = tokenHandler.WriteToken(plainToken);
                string url = getURL();
                finalURL = url + signedAndEncodedToken;
            }

            return finalURL;
        }

        public string Main()
        {
            SecurityTokenDescriptor securityTokenDescriptor = getSecurityTokenDescriptor("thisisafaketoken");

            var tokenHandler = new JwtSecurityTokenHandler();
            var plainToken = tokenHandler.CreateToken(securityTokenDescriptor);
            var signedAndEncodedToken = tokenHandler.WriteToken(plainToken);
            string url = getURL();
            return url + signedAndEncodedToken;
        }

        private string getURL()
        {
            //string url = "http://76.74.126.50/CMSStaging/spauthentication/MedSupportJWTConsumer.aspx?jwt=";
            string url = "https://www.carasolva.net/CMS/SPAuthentication/MedSupportJWTConsumer.aspx?jwt=";
            return url;
        }

        private SecurityTokenDescriptor getSecurityTokenDescriptor(string token)
        {
            string plainTextSecurityKey = getSharedSecret();
            string username = getUserName(token);
            string issuer = getCompanyAsIssuer();

            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(plainTextSecurityKey));
            var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
            DateTime now = DateTime.Now.AddMinutes(-10);
            DateTime then = DateTime.Now.AddHours(3);
            SecurityTokenDescriptor securityTokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new List<Claim>()
                    {
                        new Claim("sub", username),
                    }, "Custom"),
                NotBefore = DateTime.Now,
                SigningCredentials = signingCredentials,
                Issuer = issuer,
                IssuedAt = now,
                Expires = then,
                Audience = "www.carasolva.net",
            };
            return securityTokenDescriptor;
        }

        private string getSharedSecret()
        {
            return dg.GetCaraSolvaSecret();
            //string secret = "ToBeOrNotToBeThatIsTheQuestionWhetherTisNoblerOfAMindToSuffer";
            //return secret;
        }

        private string getCompanyAsIssuer()
        {
            return dg.GetCaraSolvaCompanyName();
            //string issuer = "Primary Solutions Anywhere";
            //string issuer = "";

            //return issuer;
        }

        private string getUserName(string token)
        {
            //string userName = "testing";
            string userName;
            if (token == "thisisafaketoken")
            {
                userName = "testing";
            }
            else
            {
                //userName = "testing";
                userName = dg.GetCaraSolvaUserName(token);
            }
            return userName;
        }
    }
}