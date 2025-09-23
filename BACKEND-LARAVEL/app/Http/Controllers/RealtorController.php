<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RealtorController extends Controller
{
    public function phdReports()
    {
        return view('realtor.phd-reports');
    }

    public function createPhdReport()
    {
        return view('realtor.phd-reports-create');
    }

    public function showPhdReport($id)
    {
        return view('realtor.phd-reports-show', compact('id'));
    }

    public function editPhdReport($id)
    {
        return view('realtor.phd-reports-edit', compact('id'));
    }

    public function storePhdReport(Request $request)
    {
        return redirect()->route('realtor.phd-reports')->with('success', 'PHD Report created successfully.');
    }

    public function updatePhdReport(Request $request, $id)
    {
        return redirect()->route('realtor.phd-reports')->with('success', 'PHD Report updated successfully.');
    }

    public function projects()
    {
        return view('realtor.projects');
    }

    public function showProject($id)
    {
        return view('realtor.projects-show', compact('id'));
    }
}
