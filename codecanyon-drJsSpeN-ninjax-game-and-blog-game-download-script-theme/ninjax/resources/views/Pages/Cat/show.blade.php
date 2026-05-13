@extends('layouts.main')

@section('content')
<!-- ============================================================= Content Start ============================================================= -->
<span class="display-zero">{{ $Locale = LaravelLocalization::getCurrentLocale() }}</span>
<div id="content-wrapper">
  <div class="container-fluid pb-0">
  <div class="video-block section-padding">
    <div class="row">
     <div class="col-md-12">
      <div class="main-title">
       <h6>{{ $Category->{'Title_'.$Locale} }}</h6>
     </div>
   </div>
@foreach($Games as $Game) 
   <div class="col-xl-3 col-sm-6 mb-3">
    <div class="video-card">
     <div class="video-card-image">
      <a class="play-icon" href="{{ url('Games') }}/{{$Game->slug}}"></a>
      <a href="{{ url('Games') }}/{{$Game->slug}}">
     <img src="{{ asset($Game->ImageUpload->filename) }}" alt="{{ $Game->meta_description }}" class="img-fluid">
   </a>
      <div class="time">{{ $Game->Category->{'Title_'.$Locale} }} </div>
    </div>
    <div class="video-card-body">
      <div class="video-title">
       <a href="{{ url('Games') }}/{{$Game->slug}}">{{ $Game->{'Title_'.$Locale} }}</a>
       <p>{!! substr($Game->{'body_'.$Locale}, 0, 180) !!}.</p>
     </div>
     <div class="video-page text-danger">
        @if(isset($Game->Category->{'Title_'.$Locale}))
  {{ $Game->Category->{'Title_'.$Locale} }}
  @else
  @endif
     </div>
     <div class="video-view">
  {{ __('main.Size')}} : {{ $Game->seo_title }} &nbsp;<i class="fas fa-calendar-alt"></i> {!! date('M j, Y', strtotime($Game->created_at)) !!}
</div>
   </div>
 </div>
</div>
@endforeach
</div>
</div>
<hr class="mt-0">
</div>
<div class="p-10"></div>
<!-- ============================================================= Content end   ============================================================= -->
@endsection