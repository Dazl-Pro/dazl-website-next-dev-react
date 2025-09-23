<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfessionalController extends Controller
{
    public function opportunities()
    {
        return view('professional.opportunities');
    }

    public function showOpportunity($id)
    {
        return view('professional.opportunities-show', compact('id'));
    }

    public function submitBid(Request $request, $id)
    {
        return redirect()->route('professional.bids')->with('success', 'Bid submitted successfully.');
    }

    public function bids()
    {
        return view('professional.bids');
    }

    public function showBid($id)
    {
        return view('professional.bids-show', compact('id'));
    }

    public function projects()
    {
        return view('professional.projects');
    }

    public function showProject($id)
    {
        return view('professional.projects-show', compact('id'));
    }
}
