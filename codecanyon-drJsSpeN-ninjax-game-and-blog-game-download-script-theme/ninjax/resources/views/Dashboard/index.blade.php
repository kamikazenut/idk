@extends('Dashboard.main')

@section('Dashboard')
<!-- START PAGE CONTENT -->
<div class="content sm-gutter">
<!-- START CONTAINER FLUID -->
<div class="container-fluid padding-25 sm-padding-10">
<!-- START ROW -->
<div class="row">
<div class="col-lg-5 col-xlg-5">
<div class="row">
<div class="col-md-12 m-b-10">
<div class="ar-3-2 widget-1-wrapper">
<!-- START WIDGET widget_imageWidget-->
<div class="widget-1 card no-border bg-complete no-margin widget-loader-circle-lg">
  <style type="text/css">
    .widget-1:after {
    background-image: url("{{ asset(option('coveruser')) }}");
    }
    .widget-2:after {
      background-image: url("{{ asset(option('covernew')) }}");
    }
    .widget-3:after {
      background-image: url("{{ asset(option('coverMessage')) }}");
    }
    .widget-4:after {
      background-image: url("{{ asset(option('coverAdSense')) }}");
    }
    .widget-5:after {
      background-image: url("{{ asset(option('coverInstagrams')) }}");
    }
  </style>
<div class="card-body">
<div class="pull-bottom bottom-left bottom-right ">
<span class="label font-montserrat fs-11">{{ count(Users()) }} Users</span>
<br>
<h2 class="text-white">You have {{ count(Users()) }} Users in your Database. </h2>
<p class="text-white hint-text"><a href="{{ route('Users.index') }}" class="text-white">Learn More at Users</a></p>
<div class="row stock-rates m-t-15">
<div class="company col-4">
<div>
<p class="font-montserrat text-success no-margin fs-16">
{{ count(Users()) }}
<span class="font-arial text-white fs-12 hint-text m-l-5">Users</span>
</p>
<p class="bold text-white no-margin fs-11 font-montserrat lh-normal">
Dashboard Users
</p>
</div>
</div>
<div class="company col-4">
<div class="pull-right">
<p class="font-montserrat text-success no-margin fs-16">
{{ count(Users()) }}
<span class="font-arial text-white fs-12 hint-text m-l-5">Admins</span>
</p>
<p class="bold text-white no-margin fs-11 font-montserrat lh-normal">
Dashboard Admin
</p>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- END WIDGET -->
</div>
</div>
</div>
<div class="row">
<div class="col-lg-12 m-b-10">
</div>
</div>
</div>
<div class="col-lg-7 col-xlg-7">
<div class="row">
<div class="col-sm-4 m-b-10">
<div class="ar-1-1">
<!-- START WIDGET widget_imageWidgetBasic-->
<div class="widget-2 card no-border bg-primary widget widget-loader-circle-lg no-margin">
<div class="card-body">
<div class="pull-bottom bottom-left bottom-right padding-25">
<span class="label font-montserrat fs-11">Posts {{ option('SiteTitle')  }}</span>
<br>
<h3 class="text-white">You have {{ count(Posts()) }} Posts in your Database. </h3>
<p class="text-white hint-text"><a href="{{ route('Posts.index') }}" class="text-white">Learn More at Posts</a></p>
</div>
</div>
</div>
<!-- END WIDGET -->
</div>
</div>
<div class="col-sm-4">
<div class="ar-1-1">
<!-- START WIDGET widget_plainLiveWidget-->
<div class="widget-3 card no-border bg-complete no-margin widget-loader-bar">
<div class="card-body no-padding full-height">
<div class="metro live-tile" data-mode="carousel" data-start-now="true" data-delay="3000">
<div class="slide-front tiles slide active">
<div class="padding-30">
<div class="pull-top">
<div class="pull-left visible-lg visible-xlg">
<i class="pg-lock"></i>
</div>
<div class="clearfix"></div>
</div>
<div class="pull-bottom p-b-30">
<p class="p-t-10 fs-12 p-b-5 hint-text"><a href="{{ route('Roles.index') }}" class="text-white">Learn More at Roles</a></p>
<h3 class="no-margin text-white p-b-10">Dashboard Roles {{ count(roles()) }}
</h3>
</div>
</div>
</div>

</div>
</div>
</div>
<!-- END WIDGET -->
</div>
</div>
<div class="col-sm-4 m-b-10">
<div class="ar-1-1">
<!-- START WIDGET widget_plainWidget-->
<div class="card no-border bg-master widget widget-6 widget-loader-circle-lg no-margin">
<div class="card-body">
<div class="pull-bottom bottom-left bottom-right padding-25">
<h1 class="text-white semi-bold"><i class=" pg-settings"></i></h1>
<span class="label font-montserrat fs-11">Settings {{ option('SiteTitle')  }}</span>
<p class="text-white m-t-20">You can get the value of each setting anywhere on your Site </p>
<p class="text-white hint-text m-t-30"><a href="{{ route('Settings.index') }}" class="text-white">Learn More at Settings</a></p>
</div>
</div>
</div>
<!-- END WIDGET -->
</div>
</div>
<div class="col-sm-4 m-b-10">
<div class="ar-1-1">
<!-- START WIDGET widget_imageWidgetBasic-->
<div class="widget-3 card no-border bg-primary widget widget-loader-circle-lg no-margin">
<div class="card-body">
<div class="pull-bottom bottom-left bottom-right padding-25">
<span class="label font-montserrat fs-11">Messages</span>
<br>
<h3 class="text-white">You have {{ count(Messages()) }} Messages in your Database. </h3>
<p class="text-white hint-text"><a href="{{ route('Messages.index') }}" class="text-white">Learn More at Messages</a></p>
</div>
</div>
</div>
<!-- END WIDGET -->
</div>
</div>
<div class="col-sm-4 m-b-10">
<div class="ar-1-1">
<!-- START WIDGET widget_imageWidgetBasic-->
<div class="widget-4 card no-border bg-primary widget widget-loader-circle-lg no-margin">
<div class="card-body">
<div class="pull-bottom bottom-left bottom-right padding-25">
<span class="label font-montserrat fs-11">Google AdSense</span>
<br>
<h3 class="text-white">You have {{ count(AdSenses()) }} Google AdSense in your Database. </h3>
<p class="text-white hint-text"><a href="{{ route('AdSense.index') }}" class="text-white">Learn More at Google AdSense</a></p>
</div>
</div>
</div>
<!-- END WIDGET -->
</div>
</div>
<div class="col-sm-4 m-b-10">
<div class="ar-1-1">
<!-- START WIDGET widget_imageWidgetBasic-->
<div class="widget-5 card no-border bg-primary widget widget-loader-circle-lg no-margin">
<div class="card-body">
<div class="pull-bottom bottom-left bottom-right padding-25">
<span class="label font-montserrat fs-11">Instagrams</span>
<br>
<h3 class="text-white">You have {{ count(Instagrams()) }} Instagrams in your Database. </h3>
<p class="text-white hint-text"><a href="{{ route('Instagrams.index') }}" class="text-white">Learn More at Instagrams</a></p>
</div>
</div>
</div>
<!-- END WIDGET -->
</div>
</div>
@foreach(Messages() as $Message)
<div class="col-sm-4 m-b-10">
<div class="card social-card share " data-social="item">
<div class="circle" data-toggle="tooltip" title="" data-container="body" data-original-title="Label">
</div>
<div class="card-header clearfix">
<div class="user-pic">
@if(isset($Message->User->ImageUpload->filename))
<img src="{{ asset($Message->User->ImageUpload->filename) }}" data-src="{{ asset($Message->User->ImageUpload->filename) }}" width="32" height="32">
@else
@endif
</div>
<h5>{{ $Message->name }}</h5>
<h6>Created at 
<span class="location semi-bold"><i class="icon-map"></i> {{ date('M j, Y', strtotime($Message->created_at)) }}</span>
</h6>
</div>
<div class="card-description">
<p>{{ $Message->Message }}</p>
</div>
</div>
</div>
@endforeach
<div class="col-lg-12">
<ul class="navbar-nav d-flex flex-row justify-content-sm-end">
<li class="nav-item">
<a href="{{ option('Facebook')  }}" class="p-r-10" ><i class="fa fa-facebook"></i></a>
</li>
<li class="nav-item">
<a href="{{ option('Twitter')  }}" class="p-r-10" ><i class="fa fa-twitter"></i></a>
</li>
<li class="nav-item">
<a href="{{ option('Facebook')  }}" class="p-r-10" ><i class="fa fa-behance"></i></a>
</li>
<li class="nav-item">
<a href="{{ option('Facebook')  }}" class="p-r-10" ><i class="fa fa-twitch"></i></a>
</li>
<li class="nav-item">
<a href="{{ option('Facebook')  }}" class="p-r-10" ><i class="fa fa-skype"></i></a>
</li>
<li class="nav-item">
<a href="{{ option('Pinterest')  }}" class="p-r-10" ><i class="fa fa-pinterest"></i></a>
</li>
<li class="nav-item">
<a href="{{ option('Facebook')  }}" class="p-r-10" ><i class="fa fa-youtube"></i></a>
</li>
<li class="nav-item">
<a href="{{ option('Instagram')  }}" class="p-r-10" ><i class="fa fa-instagram"></i></a>
</li>
</ul>
</div>
</div>
</div>
<!-- Filler -->
</div>
<!-- END ROW -->
</div>
<!-- END CONTAINER FLUID -->
</div>

@endsection