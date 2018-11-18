﻿// ==UserScript==
// @name		 Youtube cambia
// @namespace	http://tampermonkey.net/
// @version	  0.1
// @description  Cambia video de Youtube si ya se vio.
// @author	   You
// @match		https://www.youtube.com/*
// @grant		none
// ==/UserScript==

console.log(2+2)

function analizar_link(url)
{
	return url.split("?")[1].split("&").map(x=>x.split("=")).filter(x=>x[0]=="v")[0][1]
}
function guardar_videos(array)
{
	var videos_objeto = {videos:array}
	localStorage.setItem("videos",JSON.stringify(videos_objeto))
}
function agregar_y_cambiar_video()
{
	if(!location.href.includes("watch")){return;}
	var videos = localStorage.getItem("videos")
	var url = document.querySelector("#movie_player").getVideoUrl()
	var id = analizar_link(url)
	if(videos==null)
	{
		guardar_videos([id])
	}
	else{
		var videos_array = JSON.parse(videos).videos
		if(!videos_array.includes(id))
		{
			videos_array.push(id)
			guardar_videos(videos_array)
			document.title = ". " + document.title
		}
		else
		{
			var relacionados = Array.from(document.querySelector("#related").querySelectorAll("ytd-thumbnail"))
			.filter(x=>x.getAttributeNode("use-hovered-property"))
			.map(x=>analizar_link(x.querySelector("a").href))
			var hecho = false
			for(var i=0;i<relacionados.length;i++)
			{
				var actual = relacionados[i]
				if(!videos_array.includes(actual))
				{
					if(actual==undefined)
					{
						console.log(i,relacionados.length,relacionados)
					}else{
                        if(document.title[0]!=".")
                        {
                            location.href = "https://www.youtube.com/watch?v="+actual
                            hecho = true
                            break
                        }
					}
				}
			}
			if(!hecho & document.title[0]!=".")
			{
				var aleatorio = Math.floor(Math.random()*relacionados.length)
				location.href = "https://www.youtube.com/watch?v="+relacionados[aleatorio]
			}
		}
	}
}
setInterval(agregar_y_cambiar_video,10000)
