using System.Text.Json;

namespace WebAppAnapaDeti.AppCode;
public static class MigrationHelpers
{
    public static string? GetAndRemove(this ISession session, string key)
    {
        var value = session.GetString(key);
        session.Remove(key);
        return value;
    }

    public static void SetObject(this ISession session, string key, object value)
    {
        session.SetString(key, JsonSerializer.Serialize(value));
    }

    public static T? GetObject<T>(this ISession session, string key)
    {
        var value = session.GetString(key);
        return value == null ? default : JsonSerializer.Deserialize<T>(value);
    }

}