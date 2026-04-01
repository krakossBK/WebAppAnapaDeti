using Microsoft.Extensions.Options;

namespace WebAppAnapaDeti;

public class LocalStoreConfig
{
    public string? BasePath { get; set; }
}

public class LocalStoreService
{
    private readonly ILogger<LocalStoreService> _logger;

    public LocalStoreService(
        IOptions<LocalStoreConfig> options,
        ILogger<LocalStoreService> logger)
    {
        var localStoreConfig = options.Value;

        ArgumentException.ThrowIfNullOrWhiteSpace(localStoreConfig.BasePath);

        BasePath = localStoreConfig.BasePath;

        _logger = logger;
    }

    public string BasePath { get; set; }

    public byte[] GetFile(string path)
    {
        path = Path.Combine(BasePath, path);

        return File.ReadAllBytes(path);
    }

    public void Store(string path, byte[] bytes)
    {
        path = Path.Combine(BasePath, path);

        var dir = Path.GetDirectoryName(path);

        CreateDirectory(path: dir);

        File.WriteAllBytes(path, bytes);
    }

    /// <inheritdoc />
    public async Task<IEnumerable<string>> GetFiles(
        string path,
        string filter,
        SearchOption searchOption)
    {
        await Task.CompletedTask;

        return Directory.GetFiles(path, filter, searchOption);
    }

    /// <summary>
    /// выполнить stream.CopyTo(file);
    /// </summary>
    /// <param name="path">\DContent\ Далее исходя из условий</param>
    /// <param name="stream">Основным для потоков является класс System.IO.Stream</param>
    public void Store(string path, Stream stream)
    {
        path = Path.Combine(BasePath, path);

        var dir = Path.GetDirectoryName(path);

        CreateDirectory(dir);

        using var file = File.OpenWrite(path);

        stream.CopyTo(file);
    }

    public Stream OpenRead(string path)
    {
        path = Path.Combine(BasePath, path);

        return File.OpenRead(path);
    }

    public string GetFileName(string path) => Path.GetFileName(path);

    public bool TryOpen(string path, out Stream stream)
    {
        stream = Stream.Null;
        path = Path.Combine(BasePath, path);

        if (!IsFileExist(path))
            return false;

        stream = File.OpenRead(path);

        return true;
    }

    /// <summary> Удалить файл или папку по пути </summary>
    /// <param name="path"></param>
    /// <param name="recursive">Только для директорий, Это рекурсивно удалит все файлы и папки под «путем», если у вас есть на это права.</param>
    /// <returns></returns>
    public bool TryDelete(string path, bool recursive = false)
    {
        path = Path.Combine(BasePath, path);

        if (IsFileExist(path) && !recursive)
            File.Delete(path);
        else if (IsDirectoryExists(path))
            Directory.Delete(path, recursive);
        else
            return false;

        return true;
    }

    public void Move(string path, string newPath)
    {
        path = Path.Combine(BasePath, path);
        newPath = Path.Combine(BasePath, newPath);

        if (IsFileExist(path))
            File.Move(path, newPath);
        else if (IsDirectoryExists(path))
            Directory.Move(path, newPath);
        else
            throw new ArgumentException($"Path {path} does not exist");
    }

    public void Copy(string path, string newPath)
    {
        throw new NotImplementedException();
    }

    public bool Exists(string path)
    {
        path = Path.Combine(BasePath, path);

        return IsFileExist(path) || IsDirectoryExists(path);
    }

    public void Delete(string path)
    {
        path = Path.Combine(BasePath, path);

        if (IsFileExist(path))
            File.Delete(path);
        else if (IsDirectoryExists(path))
            Directory.Delete(path);
        else
            throw new ArgumentException($"Path {path} does not exist");
    }

    public string? GetDirectory(string path) => Path.GetDirectoryName(path);

    public bool IsFileExist(string path) => path.Contains(BasePath)
        ? File.Exists(path)
        : File.Exists(Path.Combine(BasePath, path));

    public bool IsDirectoryExists(string path) => path.Contains(BasePath)
        ? Directory.Exists(path)
        : Directory.Exists(Path.Combine(BasePath, path));

    public void CreateDirectory(string path)
    {
        path = path.Contains(BasePath)
            ? path
            : Path.Combine(BasePath, path);

        if (!IsDirectoryExists(path))
            Directory.CreateDirectory(path);
    }
}