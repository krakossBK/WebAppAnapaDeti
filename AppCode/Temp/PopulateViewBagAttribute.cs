using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using WebAppAnapaDeti.Models._ViewModels.Shared;

namespace WebAppAnapaDeti.AppCode.Temp;

public class PopulateViewBagAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        SM sm = context.HttpContext.RequestServices.GetRequiredService<SM>();
        if (context.Controller is Controller c)
            c.ViewBag.L = LayoutViewModel.GetLayoutViewModel(sm);
    }
}

public class EmptyViewBagAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        if (context.Controller is Controller c)
            c.ViewBag.L = new LayoutViewModel
            {
                CurrentUserContactName = "",
                CurrentUserId = "",
                Message = "",
                MessageColor = "",
                ShowSearchbar = false,
                HideHead = true
            };
    }
}