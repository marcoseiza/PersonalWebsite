---
title: "Testing Out Godot"
slug: "43f9d057-78ec-43da-90da-ea85c0702730"
date: "5 Oct 2022 1:17 PM"
excerpt: "."
---

# Testing Out Godot

[![Godot Banner](https://miro.medium.com/max/4800/1*wkoUu2cC0pU5Yckef3OqZQ.png)](https://godotengine.org/ "banner")

This last week I spent some time getting comfortable with 
[![icon](https://godotengine.org/themes/godotengine/assets/favicon.svg) Godot](https://docs.godotengine.org/en/stable/index.html "icon-text-link")! 
My goal is to make a full game with Godot by the end of the year, so I wanted 
o spend some to understand the engine beforehand.

For this test, I also decided to use 
[Godot 4.0 Beta 2](https://godotengine.org/article/dev-snapshot-godot-4-0-beta-2), 
as I was really interested in using the new tileset and tilemap editors.

The Github Repo: 
[![icon](https://github.com/fluidicon.png) Godot Test](https://github.com/marcoseiza/GodotTest "icon-text-link")

---

## Preview of What I Made

<iframe width="927" height="435" src="https://www.youtube-nocookie.com/embed/74GENsiRj_Y?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

For this test, I used a free tile asset from itch.io, 
[![icon](https://itch.io/favicon.ico) Pixel Art Top Down - Basic](https://cainos.itch.io/pixel-art-top-down-basic/ "icon-text-link"). 

---

## Challenges I Faced

The top-down 2d artstyle is aesthetically very nice, but it can pose programming
challenges when considering drawing order and physics. This is especially noticeable
when the top-down art has what are considered "tall-walls". Tall walls are any
object that should appear taller than the player. Some rules for tall walls:

- When the player is "in-front" of the wall, the player should be drawn above the wall. 
- When the player is "behind" of the wall, the player should be drawn below the wall.

<figure>
<img src="/img/draw-ordering-top-down.png"/>
<figcaption bottom>Draw Ordering Top Down</figcaption>
</figure>

This gets even more complicated when you add stairs that can move the player between
different layers. In these cases, the collision boxes need to change so that the 
player can still go behind the wall.

<figure>
<img src="/img/phyisics-hitboxes-top-down.png"/>
<figcaption bottom>Wall Physics Hitboxes in Blue and Red Changing When The Player Switches Layers</figcaption>
</figure>

I can easily switch between physics collisions by changing the physics mask on
the player. However, I need to know **WHEN** to switch the bits of the mask. 
To do this, I created a gate on the one thing that can switch the player between 
layers, _stairs_. 

I added two overlapping sensors on the stairs which I can use to test in which 
direction the player is moving in (UPWARDS or DOWNWARDS).

<figure>
<img src="/img/stair-gate.png"/>
<figcaption bottom>Stair Gate With Two Sensors Marked In Blue</figcaption>
</figure>

I used signals from bodies (like the player) entering and exiting the sensor to
test wether the top sensor is hit after the bottom sensor, or vice versa.

``` gdscript 
# Signal for player entering bottom sensor.
func _on_bottom_sensor_body_entered(body: Node2D):
	if (body.name != "Player"):
		return
	bottom_hit = true;

# Signal for player entering top sensor.
func _on_top_sensor_body_entered(body: Node2D):
	if (body.name != "Player"):
		return
	top_hit = true;

# Signal for player exiting bottom sensor.
func _on_bottom_sensor_body_exited(body: Node2D):
	if (body.name != "Player"):
		return
	bottom_hit = false;
	if (top_hit):
		action = Action.UPWARDS;

# Signal for player entering bottom sensor.
func _on_top_sensor_body_exited(body: Node2D):
	if (body.name != "Player"):
		return
	top_hit = false;
	if (bottom_hit):
		action = Action.DOWNWARDS;
```

---

## Still Left To Learn

- How to use lighting
- Allow for player to go under and above bridges
- Learn more about shaders and effects
