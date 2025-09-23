<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function projects()
    {
        return view('customer.projects');
    }

    public function createProject()
    {
        return view('customer.projects-create');
    }

    public function storeProject(Request $request)
    {
        return redirect()->route('customer.projects')->with('success', 'Project created successfully.');
    }

    public function showProject($id)
    {
        return view('customer.projects-show', compact('id'));
    }

    public function editProject($id)
    {
        return view('customer.projects-edit', compact('id'));
    }

    public function updateProject(Request $request, $id)
    {
        return redirect()->route('customer.projects')->with('success', 'Project updated successfully.');
    }

    public function projectHistory()
    {
        return view('customer.projects-history');
    }

    public function reports()
    {
        return view('customer.reports');
    }

    public function showReport($id)
    {
        return view('customer.reports-show', compact('id'));
    }

    public function projectBids($project_id)
    {
        return view('customer.bids', compact('project_id'));
    }

    public function acceptBid(Request $request, $bid_id)
    {
        return redirect()->back()->with('success', 'Bid accepted successfully.');
    }
}
