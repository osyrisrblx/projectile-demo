import { ServerSignalListener } from "@rbxts/networked-signals";
import { CylinderRenderer, Projectile } from "@rbxts/projectile";
import { ReplicatedStorage } from "@rbxts/services";
import { NetworkedSignalDescriptions } from "shared/NetworkedSignalDescriptions";

// renderer
const projectileCreatedListener = ServerSignalListener.create(
	ReplicatedStorage.Events,
	NetworkedSignalDescriptions.ProjectileCreated,
);

projectileCreatedListener.connect((character, position, velocity, acceleration, color) => {
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
	});
});
