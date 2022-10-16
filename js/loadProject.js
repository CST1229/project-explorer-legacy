let project = {};
function loadProject(t) {
	if (!response.ok) {
		setError();
		return;
	}
	try {
		JSON.parse(t);
	} catch(e) {
		if (t.startsWith("ScratchV")) {
			setError("ERROR: Scratch 1.x projects are not supported");
		}
		return;
	}
	const PROJECT = JSON.parse(t);
	if (PROJECT.code) {
		setError();
		return;
	}
	if (PROJECT.objName) {
		setError("ERROR: Scratch 2.0 projects are not supported");
		return;
	}
	
	//Ready up project metadata
	project.meta = {};
	project.meta.scratchVer = PROJECT.meta.semver;
	project.meta.vmVer = PROJECT.meta.semver;
	project.meta.browserOS = PROJECT.meta.agent;
	
	project.sprites = [];
	//Add all sprites to our project
	for (const TARGETIDX in PROJECT.targets) {
		const TARGET = PROJECT.targets[TARGETIDX];
		const SPRITE = {};
		SPRITE.name = TARGET.name;
		
		//Common variables
		SPRITE.isStage = TARGET.isStage;
		if (!TARGET.isStage) {
			SPRITE.visible = TARGET.visible;
			SPRITE.x = TARGET.x;
			SPRITE.y = TARGET.y;
			SPRITE.size = TARGET.size;
			SPRITE.direction = TARGET.direction;
			SPRITE.draggable = TARGET.draggabble;
			SPRITE.rotStyle = TARGET.rotationStyle;
		}
		SPRITE.costume = TARGET.currentCostume;
		
		//Code
		SPRITE.comments = TARGET.comments;
		SPRITE.blocks = TARGET.blocks;
		SPRITE.broadcasts = TARGET.broadcasts;
		
		//Misc variables
		SPRITE.volume = TARGET.volume;
		SPRITE.layer = TARGET.layerOrder;
		if (TARGET.isStage) {
			SPRITE.tempo = TARGET.tempo;
			
			//Video
			SPRITE.vTrans = TARGET.videoTransparency;
			SPRITE.vState = TARGET.videoState;
		}
		
		//Costumes
		SPRITE.costumes = [];
		for (const COSTIDX in TARGET.costumes) {
			const COST = TARGET.costumes[COSTIDX];
			SPRITE.costumes.push({
				name: COST.name,
				md5: COST.md5ext,
				format: COST.dataFormat
			});
		}
		
		//Sounds
		SPRITE.sounds = [];
		for (const SNDIDX in TARGET.sounds) {
			const SND = TARGET.sounds[SNDIDX];
			SPRITE.sounds.push({
				name: SND.name,
				md5: SND.md5ext,
				format: SND.dataFormat
			});
		}
		
		project.sprites.push(SPRITE);
	}
	//Clear and print debug info
	$i("message").textContent = "";
	console.log("=DEBUG INFO=\nProject:", project, "\nUnparsed project:", PROJECT);
	
	const PAGE = $i("see-inside");
	//Loop thorough all sprites and add them
	for (const SID in project.sprites) {
		const SPRITE = project.sprites[SID];
		const SPRITE_CONTAINER = PAGE.appendChild(createCustomElement(
			"div",
			"",
			{className: "sprite-container"}
		));
		SPRITE_CONTAINER.dataset.sprite = SID;
		//Adds a property
		const addProperty = function(label, val, cond) {
			if (cond) {
				SPRITE_CONTAINER.appendChild(
					createCustomElement("b", `${label}: `, {})
				);
				SPRITE_CONTAINER.appendChild(
					createCustomElement("span", val, {})
				);
				SPRITE_CONTAINER.appendChild(
					document.createElement("br")
				);
			}
		};
		//Adds a sprite name heading
		const addHead = function(text) {
			SPRITE_CONTAINER.appendChild(
				createCustomElement("h2", text, {})
			);
		};
		const IS_STAGE = SPRITE.isStage;
		addHead(SPRITE.name);
		
		addProperty("Position", SPRITE.x + ", " + SPRITE.y, !IS_STAGE);
		addProperty("Direction", SPRITE.direction, !IS_STAGE);
		addProperty("Size", SPRITE.size, !IS_STAGE);
		addProperty("Visible", SPRITE.visible ? "Yes" : "No", !IS_STAGE);
		addProperty("Current costume", SPRITE.costumes[SPRITE.costume].name, true);
		addProperty("Volume", SPRITE.volume, true);
		addProperty("Layer", SPRITE.layer, true);
		addProperty("Draggable", SPRITE.draggable ? "Yes" : "No", !IS_STAGE);
		addProperty("Rotation style", SPRITE.rotStyle, !IS_STAGE);
	}
}