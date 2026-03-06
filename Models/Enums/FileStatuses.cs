namespace WebAppAnapaDeti.Models.Enums
{
    public enum FileStatuses
    {
        /// <summary>
        /// фактический, действительный файл
        /// </summary>
        ActualFile = 0,
        /// <summary>
        /// вновь загруженный файл
        /// </summary>
        UploadNewFile = 1,
        /// <summary>
        /// удаленный файл
        /// </summary>
        DeleteFile = 2

    }

}