@extends('Dashboard.main')

@section('Dashboard')
<!-- ====================== links Roles Content Start =============================================== -->
  @if ($message = Session::get('success'))
  <div class="pgn-wrapper" data-position="top-right">
    <div class="pgn push-on-sidebar-open pgn-flip">
      <div class="alert alert-success">
        <button type="button" class="close" data-dismiss="alert">
          <span aria-hidden="true">×</span>
          <span class="sr-only">Close</span>
        </button><span>{{ $message }}</span>
      </div>
    </div>
  </div>
  @endif 
  <!-- ====================== links Roles Content Start =============================================== -->
  @if ($message = Session::get('Delete'))
  <div class="pgn-wrapper" data-position="bottom-right">
    <div class="pgn push-on-sidebar-open pgn-flip">
      <div class="alert alert-danger">
        <button type="button" class="close" data-dismiss="alert">
          <span aria-hidden="true">×</span>
          <span class="sr-only">Close</span>
        </button><span>{{ $message }}</span>
      </div>
    </div>
  </div>
  @endif
  <!-- ====================== links Roles Content Start =============================================== -->
<div class="content ">
  <!-- START PAGE COVER -->
  <div class="jumbotron page-cover" data-pages="parallax">
    <div class=" container-fluid  container-fixed-lg">
      <div class="inner">
        <!-- START BREADCRUMB -->
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="{{ url('admin') }}">Dashboard</a></li>
          <li class="breadcrumb-item active">Games</li>
        </ol>
        <!-- END BREADCRUMB -->
        <div class="container-md-height">
          <div class="row">
            <!-- START card -->
            <div class="card card-transparent">
              <div class="card-body">
                <h3><i class="fa  fa-gamepad"></i> Game <a href="{{ route('Posts.create') }}" class="btn btn-tag btn-success btn-tag-rounded">Add Game</a></h3>
              </div>
            </div>
            <!-- END card -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END PAGE COVER -->
  <!-- START CONTAINER FLUID -->
  <div class="container-fluid container-fixed-lg bg-white">
    <!-- START card -->
    <div class="card card-transparent">
      <div class="card-header ">
        <div class="card-title">Table Game
        </div>
        <div class="pull-right">
          <div class="col-xs-12">
            <input type="text" id="search-table" class="form-control pull-right" placeholder="Search">
          </div>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="card-body">
        <table class="table table-hover demo-table-search table-responsive-block" id="tableWithSearch">
          <thead>
            <tr>
              <th>Game Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Featured</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- ================================ Posts Content Start ======================== -->
            @foreach($Posts as $Post)
            <tr>
              <td class="v-align-middle semi-bold">
                <span class="thumbnail-wrapper d48 circul2 inline">
                @if(isset($Post->ImageUpload->filename))
                 <img src="{{ asset($Post->ImageUpload->filename) }}" data-src="{{ asset($Post->ImageUpload->filename) }}" width="32" height="32">
                 @else
                 <td class="v-align-middle"><a class="btn btn-tag">Game</a></td>
                 @endif
                </span>
              </td>
              <td class="v-align-middle semi-bold">
                <p>{{ $Post->Title_en  }}</p>
              </td>
              @if(isset($Post->Category->Title_en))
               <td class="v-align-middle"><a class="btn btn-tag">{{ $Post->Category->Title_en }}</a></td>
              @else
               <td class="v-align-middle"><a class="btn btn-tag">Category</a></td>
              @endif 
              <td class="v-align-middle semi-bold">
                <p>{{ $Post->featured }}</p>
              </td>
              <td class="v-align-middle text-right">
                <p>
                  <a href="{{ route('Posts.edit',$Post->slug) }}" class="btn btn-complete btn-cons btn-animated from-left fa fa-edit"><span>Edit</span></a>
                  <form action="{{ route('Posts.destroy',$Post->id) }}" method="POST" class="displayinline-block">
                  @csrf
                  @method('DELETE')
                  <button type="submit" class="btn btn-danger btn-cons btn-animated from-top fa  fa-remove">
                    <span>Delete</span>
                  </button>
                  </form>
                </p>
              </td>
            </tr>
             @endforeach
            <!-- ================================ Posts Content Start ======================== -->
          </tbody>
        </table>
        <!-- ====================== links Posts Content Start =============================================== -->
         {{ $Posts->links() }}
        <!-- ====================== links Posts Content Start =============================================== -->
      </div>
    </div>
    <!-- END card -->
  </div>
  <!-- END CONTAINER FLUID -->

  <!-- END CONTAINER FLUID -->
</div>
@endsection