namespace WebAppAnapaDeti.Models._ViewModels
{
    public class LogSiteViewModel
    {
        public int Id { get; set; }
        public int LogTypeId { get; set; }
        public DateTime TimeMsk { get; set; }
        public required string Message { get; set; }
    }
}
