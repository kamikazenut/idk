@extends('layouts.main')

@section('content')
<!-- ============================================================= Content Start ============================================================= -->
<span class="display-zero">{{ $Locale = LaravelLocalization::getCurrentLocale() }}</span>
<div id="content-wrapper">
  <div class="container-fluid pb-0">
   <div class="video-block section-padding">
    <div class="row">
     <div class="col-md-12">
      <div class="single-video-left">
       <div class="single-video-author box mb-3">
        <img class="img-fluid" src="{{ asset($Team->ImageUpload->filename) }}">
        <p><a><strong>{{ $Team->{'Title_'.$Locale} }}</strong></a></p>
        <small>{!! date('M j, Y', strtotime($Team->created_at)) !!}</small>
      </div>
      <div class="single-video-info-content box mb-3">
        <h6>{{ __('main.About_Team')}} :</h6>
        <p>{!! $Team->{'body_'.$Locale} !!}</p>
      </div>
      <div class="owl-carousel owl-carousel-category">
        @foreach($Instagrams as $Instagram)
        <div class="video-card item mr-1">
          <div class="video-card-image">
            <a><img class="img-fluid" src="{{ asset($Instagram->ImageUpload->filename) }}" alt="{{ $Instagram->{'Title_'.$Locale} }}"></a>
          </div>
        </div>
        @endforeach
      </div>
    </div>
  </div>
</div>
</div>
</div>
<div class="p-10"></div>
<!-- ============================================================= Content end   ============================================================= -->
@endsection