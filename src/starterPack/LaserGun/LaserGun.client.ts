import { ClientSignalSender } from "@rbxts/networked-signals";
import { CylinderRenderer, Projectile } from "@rbxts/projectile";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { NetworkedSignalDescriptions } from "shared/NetworkedSignalDescriptions";
import { getHumanoid } from "shared/util/getHumanoid";

const shootHumanoidSender = ClientSignalSender.create(
	ReplicatedStorage.Events,
	NetworkedSignalDescriptions.ShootHumanoid,
);

const projectileCreatedSender = ClientSignalSender.create(
	ReplicatedStorage.Events,
	NetworkedSignalDescriptions.ProjectileCreated,
);

// constants
const SHOT_COUNT = 3;
const INITIAL_VELOCITY = 75;
const GRAVITY = -50;
const MIN_SPREAD_ANGLE = math.rad(0);
const MAX_SPREAD_ANGLE = math.rad(10);

const tool = script.Parent as Tool;
const handle = tool.WaitForChild("Handle") as Part;
const attachment = handle.WaitForChild("Attachment") as Attachment;

const random = new Random();

const mouse = Players.LocalPlayer.GetMouse();

let tag: object | undefined;

mouse.Button1Down.Connect(() => {
	const localTag = {};
	tag = localTag;

	while (tag === localTag) {
		const character = Players.LocalPlayer.Character;
		if (!character || !tool.IsDescendantOf(character)) break;

		const humanoid = character.FindFirstChildWhichIsA("Humanoid");
		if (!humanoid || humanoid.Health <= 0) return;

		const position = attachment.WorldPosition;
		const endPos = mouse.Hit.Position;
		const acceleration = new Vector3(0, GRAVITY, 0);

		for (let i = 0; i < SHOT_COUNT; i++) {
			const velocity = new CFrame(position, endPos)
				.mul(CFrame.Angles(0, 0, random.NextNumber(0, 2 * math.pi))) // roll to a random angle
				.mul(CFrame.Angles(0, random.NextNumber(MIN_SPREAD_ANGLE, MAX_SPREAD_ANGLE), 0)) // spread
				.LookVector.mul(INITIAL_VELOCITY); // normalize
			const color = Color3.fromHSV(math.random(), 1, 1);

			new Projectile({
				position,
				velocity,
				acceleration,

				bounce: true,
				life: 4,
				minExitVelocity: 50,
				penetration: true,
				physicsIgnore: [character],

				renderer: new CylinderRenderer(color),
				onTouch: (part) => {
					const humanoid = getHumanoid(part);
					if (humanoid) {
						shootHumanoidSender.fire(humanoid);
					}
					return false;
				},
			});

			projectileCreatedSender.fire(character, position, velocity, acceleration, color);
		}

		task.wait(1 / 30);
	}
});

mouse.Button1Up.Connect(() => {
	tag = undefined;
});
