from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import ImageCreateForm


@login_required
def image_create(request):
    if request.method == 'POST':
        image_form = ImageCreateForm(data=request.POST)
        if image_form.is_valid():
            cd = image_form.cleaned_data
            new_image = image_form.save(commit=False)
            new_image.user = request.user
            new_image.save()
            messages.success(request, 'Image added successfully')
            return redirect(new_image.get_absolute_url())
    else:
        image_form = ImageCreateForm(data=request.GET)

    return render(
        request,
        'images/image/create.html',
        {
            'form': image_form,
            'section': 'images'
        }
    )
