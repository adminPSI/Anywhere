using Anywhere.Data;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class AnywhereAuthenticator
    {
        AuthenticationDataGetter adg = new AuthenticationDataGetter();
        DataGetter dg = new DataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

        //Create key and send email
        public string generateAuthentication(string userId, string password)
        {
            if (stringInjectionValidatorLogin(userId) == false) return null;
            if (stringInjectionValidatorLogin(password) == false) return null;
            return adg.generateAuthentication(userId, password);
        }

        //Check key and log in
        public string authenticatedLogin(string userName, string genKey)
        {
            if (stringInjectionValidatorLogin(userName) == false) return null;
            string passwordString = adg.getHashfromKey(userName, genKey);
            if (passwordString.Contains("Invalid key"))
            {
                return "Invalid key";
            }
            else if (passwordString.Contains("Too many failed"))
            {
                return "Too many failed attempts";
            }
            else if (passwordString.Contains("Expired key"))
            {
                return "Expired key";
            }
            else
            {
                Hash[] passwordObj = js.Deserialize<Hash[]>(passwordString);
                string password = passwordObj[0].Hash_Password.ToString();
                return dg.getLogIn(userName, password);
            }
        }

        public bool stringInjectionValidatorLogin(string uncheckedString)
        {
            string waitFor = "WAITFOR DELAY";
            string dropTable = "DROP TABLE";
            string deleteFrom = "DELETE FROM";
            string singleQuote = "'";
            if (!string.IsNullOrWhiteSpace(uncheckedString) && (uncheckedString.ToUpper().Contains(waitFor) || uncheckedString.ToUpper().Contains(dropTable) || uncheckedString.ToUpper().Contains(singleQuote) || uncheckedString.ToUpper().Contains(deleteFrom)))
            {
                return false;
            }
            else
            {
                return true;
            }

        }

        public class Hash
        {
            public string Hash_Password { get; set; }
        }
    }
}