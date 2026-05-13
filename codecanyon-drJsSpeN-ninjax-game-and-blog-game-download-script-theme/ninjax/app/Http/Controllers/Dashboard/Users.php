<?php

namespace App\Http\Controllers\Dashboard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoles;
use App\Http\Requests\StoreUsers;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\User;   
use Auth;
use File;
use Validator;
use App\ImageUpload;


class Users extends Controller
{


    /**
     * Show the middleware dashboard Super-Admin.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function __construct()
    {
        $this->middleware(['auth','role_or_permission:Super-Admin|edit articles']);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       // GET Users
       $Users = User::simplePaginate(5); 
       return view('Dashboard.Users.index',compact('Users')); 
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    { 
        // GET Roles
        $Roles = Role::all();
        // GET dashboardRoles create
        return view('Dashboard.Users.create',compact('Roles'));
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
            // GET validate
        $request->validate([
        'name' => 'required',
        'email' => 'required',
        'email' => 'required',
        'password' => 'required|confirmed|min:6',
        ]);

        $ImageUpload = ImageUpload::max('id');
        $user = User::create([
            'name' => $request->name,    
            'email' => $request->email,  
            'Phone' => $request->Phone,   
            'ImageUpload_id' => $ImageUpload, 
            'password' => Hash::make($request->password) 

        ]);
           $Roles = $request['roles']; //Retrieving the roles field
         //Checking if a role was selected
        if (isset($Roles)) {

            foreach ($Roles as $role) {
            $role_r = Role::where('id', '=', $role)->firstOrFail();            
            $user->assignRole($role_r); //Assigning role to user
            }
        }   


            return redirect()->route('Users.index')

                        ->with('success','User Store successfully.');

    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($name)
    {
         //To Get All User 
        $User = User::where('name', '=', $name)->firstOrFail();
        // GET Roles
        $Roles = Role::all();
        return view('Dashboard.Users.edit',compact('User','Roles'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $name)
    {
        // GET User
        $User = User::where('name', '=', $name)->firstOrFail();
        $ImageOld = ImageUpload::max('id');
        if($ImageOld != $User->ImageUpload_id) {
            $UserImage = $User->ImageUpload_id;
            $UserImage = ImageUpload::findOrFail($UserImage);
            File::delete($UserImage->filename);
            $UserImage->delete();
        }
        // GET validate
        $data = $request->validate([
        'name' => 'required',
        'Phone' => 'required'
        ]);
        $User->name = $request->input('name');
        $User->email = $request->input('email');
        $User->Phone = $request->input('Phone');
        $User->ImageUpload_id = $ImageOld;
        $User->password = Hash::make($request->password);
         $Roles = $request['roles']; //Retreive all roles
          if (isset($Roles)) {        
            $User->roles()->sync($Roles);  //If one or more role is selected associate user to roles          
        }        
        else {
            $User->roles()->detach(); //If no role is selected remove exisiting role associated to a user
        }
        $User->save();
        return redirect()->route('Users.index')

                        ->with('success','User Updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
           // User Delete
        $User = User::findOrFail($id);
        $UserImage = $User->ImageUpload_id;
        $UserImage = ImageUpload::findOrFail($UserImage);
        File::delete($UserImage->filename);
        $UserImage->delete();
        $UserRole = Role::findOrFail($User);
        $User->delete();
        return back()->with('Delete','User deleted successfully');
    }
}
