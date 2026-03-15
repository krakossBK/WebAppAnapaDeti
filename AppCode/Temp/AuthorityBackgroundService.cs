namespace WebAppAnapaDeti.AppCode.Temp;

public class DateProvider : IDateProvider
{
    public DateTime Now => C.MoscowDateTime;
}

public interface IDateProvider
{
    DateTime Now { get; }
}