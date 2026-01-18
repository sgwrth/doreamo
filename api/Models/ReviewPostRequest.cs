namespace api.Models;

public class ReviewPostRequest
{
    public required string BookId { set; get; }
    public required int Rating { set; get; }
    public required string Text { set; get; }
    public required string Author { set; get; }
}