using System.Security.Cryptography;
using System.Text;

namespace WebAppAnapaDeti.AppCode;

public class SecurityHelper
{
    private static readonly string pass = "jPnCmuM8l0dglD#@";
    private static readonly string sol = "OWwz26}#";
    private static readonly string cryptographicAlgorithm = "SHA1";
    private static readonly int passIter = 2;
    private static readonly string initVec = "7sTwxbvRPGhAhe~X";
    private static readonly int keySize = 256;

    public static string Encryption(string ishText)
    {
        if (string.IsNullOrEmpty(ishText))
            return "";

        var initVecB = Encoding.ASCII.GetBytes(initVec);
        var solB = Encoding.ASCII.GetBytes(sol);
        var ishTextB = Encoding.UTF8.GetBytes(ishText);

        var derivPass = new PasswordDeriveBytes(pass, solB, cryptographicAlgorithm, passIter);
        var keyBytes = derivPass.GetBytes(keySize / 8);
        var symmK = new RijndaelManaged
        {
            Mode = CipherMode.CBC
        };

        byte[]? cipherTextBytes = null;

        using (var encryptor = symmK.CreateEncryptor(keyBytes, initVecB))
        {
            using MemoryStream memStream = new();
            using CryptoStream cryptoStream = new(memStream, encryptor, CryptoStreamMode.Write);
            cryptoStream.Write(ishTextB, 0, ishTextB.Length);
            cryptoStream.FlushFinalBlock();
            cipherTextBytes = memStream.ToArray();
            memStream.Close();
            cryptoStream.Close();
        }

        symmK.Clear();
        return Convert.ToBase64String(cipherTextBytes);
    }
    public static string Decryption(string ciphText)
    {
        if (string.IsNullOrEmpty(ciphText))
            return "";

        var initVecB = Encoding.ASCII.GetBytes(initVec);
        var solB = Encoding.ASCII.GetBytes(sol);
        var cipherTextBytes = Convert.FromBase64String(ciphText);

        var derivPass = new PasswordDeriveBytes(pass, solB, cryptographicAlgorithm, passIter);
        var keyBytes = derivPass.GetBytes(keySize / 8);

        var symmK = new RijndaelManaged
        {
            Mode = CipherMode.CBC
        };

        var plainTextBytes = new byte[cipherTextBytes.Length];
        var byteCount = 0;

        using (ICryptoTransform decryptor = symmK.CreateDecryptor(keyBytes, initVecB))
        {
            using MemoryStream mSt = new(cipherTextBytes);
            using CryptoStream cryptoStream = new(mSt, decryptor, CryptoStreamMode.Read);
            byteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
            mSt.Close();
            cryptoStream.Close();
        }

        symmK.Clear();
        return Encoding.UTF8.GetString(plainTextBytes, 0, byteCount);
    }

}
