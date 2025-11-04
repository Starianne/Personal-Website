from django.shortcuts import render

def huhpage(request):
    return render(request, 'huh.html')
