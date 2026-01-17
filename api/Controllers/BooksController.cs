using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BooksService _booksService;
    
    public BooksController(BooksService booksService) =>
        _booksService = booksService;

    [Authorize]
    [HttpGet]
    public async Task<List<Book>> Get() =>
        await _booksService.GetAsync();

    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task Post(Book book) =>
        await _booksService.PostAsync(book);

    [Authorize]
    [HttpDelete]
    public async Task Delete(DeleteBookRequest req) =>
        await _booksService.DeleteAsync(req.BookId);
}