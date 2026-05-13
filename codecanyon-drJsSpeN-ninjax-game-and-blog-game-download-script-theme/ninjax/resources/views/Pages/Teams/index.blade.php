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
                  <h6>{{ __('main.Gaming_Teams')}}</h6>
               </div>
            </div>
            @foreach($Teams as $Team)
            <div class="col-xl-3 col-sm-6 mb-3">
               <div class="channels-card">
                  <div class="channels-card-image">
                     <a href="{{ url('Teams') }}/{{$Team->id}}">
                        <img src="{{ asset($Team->ImageUpload->filename) }}" alt="{{ $Team->{'Title_'.$Locale} }}" class="img-fluid">
                     </a>
                  </div>
                  <div class="channels-card-body">
                     <div class="channels-title">
                        <a href="{{ url('Teams') }}/{{$Team->id}}">{{ $Team->{'Title_'.$Locale} }}</a>
                     </div>
                     <div class="channels-view">
                        {!! substr($Team->{'body_'.$Locale}, 0, 180) !!}.
                     </div>
                  </div>
               </div>
            </div>
            @endforeach
         </div>
         <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center pagination-sm mb-4">
               <!-- ================ /New Teams content =================== -->
               {{ $Teams->links() }}
               <!-- ================ /New Teams content =================== -->
            </ul>
         </nav>
      </div>
      <hr>
      <div class="video-block section-padding">
         <div class="row">
            <div class="col-md-12">
               <div class="main-title">
                  <div class="btn-group float-right right-action">
                   <a class="btn btn-default" href="{{ url('Games') }}">{{ __('main.Featured_Games')}}</a>
                </div>
                <h6>{{ __('main.Featured_Games')}}</h6>
             </div>
          </div>
          @foreach($FeaturedGames as $FeaturedGame) 
          <div class="col-xl-3 col-sm-6 mb-3">
             <div class="video-card">
               <div class="video-card-image">
                 <a class="play-icon" href="{{ url('Games') }}/{{$FeaturedGame->slug}}"></a>
                 <a href="{{ url('Games') }}/{{$FeaturedGame->slug}}">
                   <img src="{{ asset($FeaturedGame->ImageUpload->filename) }}" alt="{{ $FeaturedGame->meta_description }}" class="img-fluid">
                </a>
                @if(isset($FeaturedGame->Category->{'Title_'.$Locale}))
                <div class="time">{{ $FeaturedGame->Category->{'Title_'.$Locale} }} </div>
                @else
                @endif
             </div>
             <div class="video-card-body">
                <div class="video-title">
                  <a href="{{ url('Games') }}/{{$FeaturedGame->slug}}">{{ $FeaturedGame->{'Title_'.$Locale} }}</a>
                  <p>{!! substr($FeaturedGame->{'body_'.$Locale}, 0, 180) !!}.</p>
               </div>
               <div class="video-page text-danger">
                @if(isset($FeaturedGame->Category->{'Title_'.$Locale}))
                {{ $FeaturedGame->Category->{'Title_'.$Locale} }}
                @else
                @endif
               </div>
               <div class="video-view">
                {{ __('main.Size')}} : {{ $FeaturedGame->seo_title }} &nbsp;<i class="fas fa-calendar-alt"></i> {!! date('M j, Y', strtotime($FeaturedGame->created_at)) !!}
             </div>
          </div>
       </div>
    </div>
    @endforeach
 </div>
</div>
</div>
<div class="p-10"></div>
<!-- ============================================================= Content end   ============================================================= -->
@endsection