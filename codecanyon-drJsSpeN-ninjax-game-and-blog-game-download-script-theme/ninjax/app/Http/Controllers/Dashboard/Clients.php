<?php

namespace App\Http\Controllers\Dashboard;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClient;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\User; 
use App\Client;
use Auth;
use File;
use Validator;
use App\ImageUpload;

class Clients extends Controller
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
        // GET Clients
        $Clients = Client::simplePaginate(5);
        return view('Dashboard.Clients.index',compact('Clients'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // GET dashboardRoles create
        return view('Dashboard.Clients.create');
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
        'Title_ar' => 'required',
        'Title_en' => 'required',
        'Title_fr' => 'required',
        'body_ar' => 'required',
        'body_en' => 'required',
        'body_fr' => 'required'
        ]);

        $ImageUpload = ImageUpload::max('id');
        Client::create([  
            'Title_ar' => $request->Title_ar,  
            'Title_en' => $request->Title_en, 
            'Title_fr' => $request->Title_fr,
            'body_ar' => $request->body_ar,  
            'body_en' => $request->body_en,
            'body_fr' => $request->body_fr,
            'ImageUpload_id' => $ImageUpload
        ]);

            return redirect()->route('Clients.index')

                        ->with('success','Client Store successfully.');
    }

   /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $slug
     * @return \Illuminate\Http\Response
     */
    public function edit($Title_en)
    {
        //To Get All Client 
        $Client = Client::where('Title_en', '=', $Title_en)->firstOrFail();
        return view('Dashboard.Clients.edit',compact('Client'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $Title_en
     * @return \Illuminate\Http\Response
     */
    
    public function update(Request $request, $Title_en)
    {
        // GET Client
        $Client = Client::where('Title_en', '=', $Title_en)->firstOrFail();
        $ImageOld = ImageUpload::max('id');
        if($ImageOld != $Client->ImageUpload_id) {
            $ClientImage = $Client->ImageUpload_id;
            $ClientImage = ImageUpload::findOrFail($ClientImage);
            File::delete($ClientImage->filename);
            $ClientImage->delete();
        }
        $request->validate([
        'Title_ar' => 'required',
        'Title_en' => 'required',
        'Title_fr' => 'required',
        'body_ar' => 'required',
        'body_en' => 'required',
        'body_fr' => 'required'
        ]);

        $Client->Title_ar = $request->input('Title_ar');
        $Client->Title_en = $request->input('Title_en');
        $Client->Title_fr = $request->input('Title_fr');
        $Client->body_ar = $request->input('body_ar');
        $Client->body_en = $request->input('body_en');
        $Client->body_fr = $request->input('body_fr');
        $Client->ImageUpload_id = $ImageOld;
        $Client->save();
        return redirect()->route('Clients.index')

                        ->with('success','Client Updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Client Delete
        $Client = Client::findOrFail($id);
        $ClientImage = $Client->ImageUpload_id;
        $ClientImage = ImageUpload::findOrFail($ClientImage);
        File::delete($ClientImage->filename);
        $ClientImage->delete();
        $Client->delete();
        return back()->with('Delete','Client deleted successfully');
    }
}
