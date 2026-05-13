@extends('Dashboard.main')

@section('Dashboard')
<!-- START PAGE CONTENT -->
<div class="content ">
  <!-- START PAGE COVER -->
  <div class="jumbotron page-cover" data-pages="parallax">
    <div class=" container-fluid  container-fixed-lg">
      <div class="inner">
        <!-- START BREADCRUMB -->
        <ol class="breadcrumb">  
          <li class="breadcrumb-item"><a href="{{ url('admin') }}">Dashboard</a></li>
          <li class="breadcrumb-item"><a href="{{ route('Users.index') }}">Users</a></li>
          <li class="breadcrumb-item active">Create User</li>
        </ol>
        <!-- END BREADCRUMB -->
        <div class="container-md-height">
          <div class="row">
            <!-- START card -->
            <div class="card card-transparent">
              <div class="card-body">
                <h3><i class="fa fa-meh-o"></i> add User</h3>
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
  <div class=" container-fluid container-fixed-lg">
    <!-- START card -->
    <div class="row">
      <div class="col-lg-6">
        <!-- START card -->
        <div class="card card-default">
          <div class="card-header ">
            <div class="card-title">
              Create your User
            </div>
          </div>
          @if ($errors->any())    
          <div class="pgn-wrapper top-inline" data-position="top">
            <div class="pgn push-on-sidebar-open pgn-bar">
              <div class="alert alert-danger">
                <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                @foreach ($errors->all() as $error)
                {{ $error }}
                @endforeach
              </div>
            </div>
          </div>
          @endif
          <div class="card-body">
            <form action="{{ route('Users.store') }}" method="POST"  role="form" enctype="multipart/form-data"> 
              @csrf
              <div class="form-group form-group-default required">
                <label for="name">name</label>
                <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" required="" placeholder="ex: example muhannad Meteors"> 
                @error('name')
                <div class="alert alert-danger">{{ $message }}</div>
                @enderror
              </div>
              <div class="form-group form-group-default required">
                <label for="Phone">Phone</label>
                <input type="text" class="form-control @error('Phone') is-invalid @enderror" id="Phone" name="Phone" required="" placeholder="ex:(002) 020"> 
                @error('Phone')
                <div class="alert alert-danger">{{ $message }}</div>
                @enderror
              </div>
              <div class="form-group form-group-default required">
                <label for="password">Password</label>
                <input type="password" placeholder="ex: example muhannad Meteors" class="form-control @error('password') is-invalid @enderror" id="password" name="password">
                @error('password')
                <div class="alert alert-danger">{{ $message }}</div>
                @enderror
              </div>
              <div class='form-group'>
              @foreach ($Roles as $role)
                  {{ Form::checkbox('roles[]',  $role->id ) }}
                  {{ Form::label($role->name, ucfirst($role->name)) }}<br>
              @endforeach
              </div>
              <div class="form-group form-group-default required">
                <label for="password_confirmation">Password confirmation</label>
                <input type="password" placeholder="ex: example muhannad Meteors" class="form-control @error('password_confirmation') is-invalid @enderror" id="password_confirmation" name="password_confirmation">
                @error('password_confirmation')
                <div class="alert alert-danger">{{ $message }}</div>
                @enderror
              </div>
              <div class="form-group form-group-default required">
                <label for="email">email</label>
                <input type="email" class="form-control @error('email') is-invalid @enderror" placeholder="ex: some@example.com" required="" id="email" name="email">
                @error('email')
                <div class="alert alert-danger">{{ $message }}</div>
                @enderror
              </div>
              <button class="btn btn-success btn-cons btn-animated from-left fa fa-save pull-right" type="submit">
                <span>save</span>
              </button>
              </form>
            </div>
          </div>
          <!-- END card -->
        </div>
        <div class="col-lg-6">
         <!-- START card -->
         <div class="card card-default">
          <div class="card-header ">
            <div class="card-title">
              Drag and drop Avatar Here 
            </div>
          </div>
          <div class="card-body no-scroll no-padding">
            <div class="card-body no-scroll no-padding">
              <form method="post" action="{{url('Dashboard/image/upload/store')}}" enctype="multipart/form-data" class="dropzone" id="dropzone">
               @csrf
              </form> 
          </div>
        </div> 
      </div>
    </div>
    <!-- END card -->
  </div>
</div>
<!-- END card -->
</div>
<!-- END PAGE CONTENT -->
@endsection