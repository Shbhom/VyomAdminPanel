import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request:NextRequest) {
    let supabaseResponse = NextResponse.next({request}) 

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies:{
                getAll(){
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet:any){
                    for (const {name, value} of cookiesToSet){
                        request.cookies.set(name,value)
                    }
                    supabaseResponse = NextResponse.next({
                        request
                    })
                    for (const {name,value,options} of cookiesToSet ){
                        supabaseResponse.cookies.set(name,value,options)
                    }
                }
            }
        }
    )
    const {data:{user}} = await supabase.auth.getUser()

    if(!user && !request.nextUrl.pathname.startsWith("/login")){
        const url = request.nextUrl.clone()
        url.pathname = "/login"
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}