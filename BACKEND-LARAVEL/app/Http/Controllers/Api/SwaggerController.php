<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="DAZL Platform API Documentation",
 *     description="Enterprise-grade API for the DAZL home improvement marketplace platform. Connect customers, professionals, and realtors through comprehensive project management, bidding system, and home diagnostic reports.",
 *     termsOfService="https://dazl.com/terms",
 *     @OA\Contact(
 *         email="api@dazl.com",
 *         name="DAZL API Support"
 *     ),
 *     @OA\License(
 *         name="Proprietary",
 *         url="https://dazl.com/license"
 *     )
 * )
 *
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Development Server"
 * )
 *
 * @OA\Server(
 *     url="https://api.dazl.com",
 *     description="Production Server"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token."
 * )
 *
 * @OA\Tag(
 *     name="Authentication",
 *     description="User authentication endpoints for customers, professionals, and realtors"
 * )
 *
 * @OA\Tag(
 *     name="Projects",
 *     description="Project management and lifecycle operations"
 * )
 *
 * @OA\Tag(
 *     name="Bidding",
 *     description="Professional bidding and opportunity management"
 * )
 *
 * @OA\Tag(
 *     name="Payments",
 *     description="Payment processing and transaction management"
 * )
 *
 * @OA\Tag(
 *     name="Reports",
 *     description="Home diagnostic reports (PHD) and analytics"
 * )
 *
 * @OA\Tag(
 *     name="Services",
 *     description="Service types and categories management"
 * )
 *
 * @OA\Tag(
 *     name="Companies",
 *     description="Professional company profiles and directory"
 * )
 *
 * @OA\Tag(
 *     name="Blog",
 *     description="Content management and blog operations"
 * )
 */
class SwaggerController extends Controller
{
    // This controller serves as the main documentation hub
}