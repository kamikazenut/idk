<!DOCTYPE html>
<html lang="zxx">
<head>
    <!-- ===================================== Meta Site ================================================ -->
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
    <meta name="description" content="{{ option('MetaDescription')  }}">
    <meta name="author" content="{{ option('Metaauthor') }}">
    <meta name="keywords" content="{{ option('MetaKeyWords') }}">  
    <meta name="robots" content="{{ option('Metarobots')  }}">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">
    <link rel="apple-touch-icon" sizes="57x57" href="{{ asset('assets/images/favicon/apple-icon-57x57.png') }}">
    <link rel="apple-touch-icon" sizes="60x60" href="{{ asset('assets/images/favicon/apple-icon-60x60.png') }}">
    <link rel="apple-touch-icon" sizes="72x72" href="{{ asset('assets/images/favicon/apple-icon-72x72.png') }}">
    <link rel="apple-touch-icon" sizes="76x76" href="{{ asset('assets/images/favicon/apple-icon-76x76.png') }}">
    <link rel="apple-touch-icon" sizes="114x114" href="{{ asset('assets/images/favicon/apple-icon-114x114.png') }}">
    <link rel="apple-touch-icon" sizes="120x120" href="{{ asset('assets/images/favicon/apple-icon-120x120.png') }}">
    <link rel="apple-touch-icon" sizes="144x144" href="{{ asset('assets/images/favicon/apple-icon-144x144.png') }}">
    <link rel="apple-touch-icon" sizes="152x152" href="{{ asset('assets/images/favicon/apple-icon-152x152.png') }}">
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('assets/images/favicon/apple-icon-180x180.png') }}">
    <link rel="icon" type="image/png" sizes="192x192" href="{{ asset('assets/images/favicon/android-icon-192x192.png') }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset(option('Favicon')) }}">
    <link rel="icon" type="image/png" sizes="96x96" href="{{ asset(option('Favicon')) }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset(option('Favicon')) }}">
    <link rel="manifest" href="{{ asset('assets/images/favicon/manifest.json') }}">
    <title>{!! option('SiteTitle') !!}</title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700|Rajdhani:600,700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Amiri:400,700&display=swap" rel="stylesheet">
    <link href="{{ asset('assets/vendor/bootstrap/css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/vendor/fontawesome-free/css/all.min.css') }}" rel="stylesheet" type="text/css">
    <link href="{{ asset('assets/css/style.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('assets/vendor/owl-carousel/owl.carousel.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/vendor/owl-carousel/owl.theme.css') }}">
    <span class="display-zero">{{ $Locale = LaravelLocalization::getCurrentLocale() }}</span>
    @if($Locale == 'ar')
    <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@100..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('assets/css/rtl.css') }}" />
    @else
    @endif
</head>
<body id="page-top">
    <nav class="navbar navbar-expand navbar-light bg-white static-top ninjax-nav sticky-top"> &nbsp;&nbsp;
        <a class="navbar-brand mr-1" href="{{ url('') }}">
        @if($Locale == 'ar')
        <img  class="img-fluid" alt="{{ option('SiteTitle')  }}" src="{{ asset(option('logo-rtl')) }}">
        @else
        <img  class="img-fluid" alt="{{ option('SiteTitle')  }}" src="{{ asset(option('logo')) }}">
        @endif
        </a>
        <!-- ================================ Search form ================================ -->
        <form class="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-5 my-2 my-md-0 ninjax-navbar-search" 
              method="GET" action="{!! url('search') !!}" 
        enctype="multipart/form-data" role="search">
        {!! csrf_field() !!}
        <div class="input-group">
            <input class="form-control" type="search" placeholder="{{ __('main.Search')}}" autofocus name="search">
            <div class="input-group-append">
                <button class="btn btn-light" type="submit">
                    <i class="fas fa-search"></i> 
                </button>
            </div>
        </div>
    </form>
    <!-- ================================ Search Form ================================ -->
    <ul class="navbar-nav ml-auto ml-md-0 ninjax-right-navbar">
        <button class="btn btn-link btn-sm text-secondary order-1 order-sm-0" id="sidebarToggle">
            <i class="fas fa-bars"></i>
        </button>
        @guest
        <li class="nav-item dropdown no-arrow ninjax-right-navbar-user">
            <a class="nav-link dropdown-toggle user-dropdown-link" href="#" id="userDropdown" role="button" 
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img alt="Avatar" src="{!! asset('assets/images/avatar.jpg') !!}">
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
            <a class="dropdown-item" href="{{ route('login') }}"><i class="fas fa-sign-in-alt"></i> &nbsp; {{ __('main.Login')}}</a>
            <a class="dropdown-item" href="{{ route('register') }}"><i class="fas fa-user-ninja"></i> &nbsp; {{ __('main.Register')}}</a>
            <div class="dropdown-divider"></div>
        </div>
    </li>
    @else
    <li class="nav-item dropdown no-arrow ninjax-right-navbar-user">
        <a class="nav-link dropdown-toggle user-dropdown-link" href="#" 
           id="userDropdown" 
           role="button" 
        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        @if(isset(Auth::user()->ImageUpload->filename))
        <img src="{{ asset(Auth::user()->ImageUpload->filename) }}" alt="{{ Auth::user()->name }}">
        @else
        @endif
    </a>
    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
        <a class="dropdown-item color-w"><i class="fas fa-user-ninja"></i> &nbsp; {{ Auth::user()->name }}</a>
        @hasrole('Super-Admin')
          <a href="{!! url('admin') !!}" class="dropdown-item color-w"><i class="fas fa-user-ninja"></i> &nbsp; Dashboard</a>
        @else
          <a class="dropdown-item color-w"><i class="fas fa-fw fa-user-circle"></i> &nbsp; {{ Auth::user()->name }}</a>
        @endhasrole
        <div class="dropdown-divider"></div>
        <!-- ===============================  CONTENT ======================================== -->
        <a class="dropdown-item" href="{{ route('logout') }}" onclick="event.preventDefault();document.getElementById('logout-form').submit();">
            <i class="fas fa-fw fa-sign-out-alt"></i>
        &nbsp; {{ __('main.Logout')}}</a>
        <form id="logout-form" action="{{ route('logout') }}" method="POST" class="display-zero">
            @csrf
        </form>
        <!-- ===============================  CONTENT  ======================================== -->
    </div>
</li>
@endguest
</ul>
</nav>
<!--********************************************************-->
<!--********************** SITE header *********************-->
<!--********************************************************-->
@section('sidebar')
<div id="wrapper">
    <!-- =========================== Start Sidebar =========================== -->
    <ul class="sidebar navbar-nav">
        @foreach(Menus() as $Menu)
        <li class="nav-item">
         <a class="nav-link" href="{{ url($Menu->url) }}" target="{{ $Menu->target }}">
             <i class="fas fa-caret-square-right"></i> 
             <span>{{ $Menu->{'Title_'.$Locale} }}</span>
         </a>
     </li>
     @endforeach
     @guest
     <li class="nav-item">
         <a class="nav-link" href="{{ route('login') }}">
             <i class="fas fa-sign-in-alt"></i>
             <span>{{ __('main.Login')}}</span>
         </a>
     </li>
     <li class="nav-item">
         <a class="nav-link" href="{{ route('register') }}">
             <i class="fas fa-user-plus"></i>
             <span>{{ __('main.Register')}}</span>
         </a>
     </li>
     @else
     @endguest
     <li class="nav-item dropdown">
         <a class="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
             <i class="fas fa-fw fa-list-alt"></i>
             <span>{{ __('main.Browse_categories')}}</span>
         </a>
         <div class="dropdown-menu">
          <!-- =============================== BASE ======================================== -->
          @foreach(Categories() as $Category)
          <a class="dropdown-item" href="{!! url('Cat') !!}/{!! $Category->slug !!}">{!! $Category->{'Title_'.$Locale} !!}</a>
          @endforeach
      </div>
  </li>
     <li class="nav-item dropdown">
     <a class="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
         <i class="fas fa-fw fa-language"></i>
         <span>{{ __('main.languages')}}</span>
     </a>
     <div class="dropdown-menu">
      <!-- =============================== BASE ======================================== -->
       @foreach(LaravelLocalization::getSupportedLocales() as $localeCode => $properties)
        <a  class="dropdown-item" rel="alternate" hreflang="{{ $localeCode }}" href="{{ LaravelLocalization::getLocalizedURL($localeCode, null, [], true) }}">
            {{ $properties['native'] }}
        </a>
       @endforeach
</div>
</li>
</ul>
@show
@yield('content')
<!--********************************************************-->
<!--********************** SITE FOOTER *********************-->
<!--********************************************************--> 
<!-- Sticky Footer -->
<footer class="sticky-footer">
 <div class="container">
  <div class="row no-gutters">
   <div class="col-lg-6 col-sm-6">
    <p class="mt-1 mb-0">{{ __('main.All_reserved')}} <strong class="text-dark">{{ option('SiteTitle')  }}</strong>.<br></p>
  </div>
  <div class="col-lg-6 col-sm-6 text-right">
    <div class="app">
     <a><img alt="{{ option('SiteTitle')  }}" src="{{ asset('assets/images/gplay.png') }}"></a>
     <a><img alt="{{ option('SiteTitle')  }}" src="{{ asset('assets/images/aplay.png') }}"></a>
   </div>
 </div>
</div>
</div>
</footer>
</div>
<!-- /.content-wrapper -->
</div>  
<!-- Scroll to Top Button-->
<a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
</a>
<!-- Bootstrap core JavaScript-->
<script src="{{ asset('assets/vendor/jquery/jquery.min.js') }}"></script>
<script src="{{ asset('assets/vendor/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
<!-- Core plugin JavaScript-->
<script src="{{ asset('assets/vendor/jquery-easing/jquery.easing.min.js') }}"></script>
<!-- Owl Carousel -->
<script src="{{ asset('assets/vendor/owl-carousel/owl.carousel.js') }}"></script>
<!-- Custom scripts for all pages-->
<script src="{{ asset('assets/js/custom.js') }}"></script>
</body>
</html>