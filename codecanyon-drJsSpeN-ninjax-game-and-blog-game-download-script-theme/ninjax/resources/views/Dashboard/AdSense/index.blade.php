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
<!-- START PAGE CONTENT -->
<div class="content ">
  <!-- START PAGE COVER -->
  <div class="jumbotron page-cover" data-pages="parallax">
    <div class=" container-fluid  container-fixed-lg">
      <div class="inner">
        <!-- START BREADCRUMB -->
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="{{ url('admin') }}">Dashboard</a></li>
          <li class="breadcrumb-item active">Ads Management</li>
        </ol>
        <!-- END BREADCRUMB -->
        <div class="container-md-height">
          <div class="row">
            <!-- START card -->
            <div class="card card-transparent">
              <div class="card-body">
                <h3><i class="pg-grid"></i>  Ads Managements <a href="{{ route('AdSense.create') }}" class="btn btn-tag btn-success btn-tag-rounded">Add Ads</a></h3>
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
  <div class=" container-fluid   container-fixed-lg bg-white">
    <!-- START card -->
    <div class="card card-transparent">
      <div class="card-header ">
        <div class="card-title">Table  Ads Management 
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
              <th>Ads image - Code</th>
              <th>Title</th>
              <th>Type</th>
              <th>Location</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- ================================ AdSenses Content Start ======================== -->
            @foreach($AdSenses as $AdSense)
            <tr>
              <td class="v-align-middle semi-bold">
                <span class="thumbnail-wrapper d48 circul2 inline">
                @if(isset($AdSense->ImageUpload->filename))
                 <img src="{{ asset($AdSense->ImageUpload->filename) }}" alt="{{ $AdSense->name  }}" data-src="{{ asset($AdSense->ImageUpload->filename) }}" width="32" height="32">
                 @else
                 <td class="v-align-middle"><a class="btn btn-tag">Images</a></td>
                 <img alt="{{ $AdSense->name  }}" width="32" height="32">
                 @endif
                </span>
              </td>
              <td class="v-align-middle semi-bold">
                <p>{{ $AdSense->name  }}</p>
              </td>
              <td class="v-align-middle"><a class="btn btn-tag">{{ $AdSense->Type  }}</a></td>
              <td class="v-align-middle semi-bold">
                <p>{{ $AdSense->Active  }}</p>
              </td>
              <td class="v-align-middle text-right">
               <p>
                  <a href="{{ route('AdSense.edit',$AdSense->name) }}" class="btn btn-complete btn-cons btn-animated from-left fa fa-edit"><span>Edit</span></a>
                  <form action="{{ route('AdSense.destroy',$AdSense->id) }}" method="POST" class="displayinline-block">
                  @csrf
                  @method('DELETE')
                  <button type="submit" class="btn btn-danger btn-cons btn-animated from-top fa fa-remove">
                    <span>Delete</span>
                  </button>
                  </form>
                </p>
              </td>
            </tr>
            @endforeach
            <!-- ================================ AdSenses Content Start ======================== -->
          </tbody>
        </table>
         <!-- ====================== links Users Content Start =============================================== -->
         {{ $AdSenses->links() }}
        <!-- ====================== links Users Content Start =============================================== -->
      </div>
    </div>
    <!-- END card -->
  </div>
</div>
<!-- END PAGE CONTENT -->
@endsection