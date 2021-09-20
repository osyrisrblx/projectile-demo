import { createBaseplate } from "@rbxts/baseplate";
import { ClientSignalListener, ServerSignalSender } from "@rbxts/networked-signals";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { NetworkedSignalDescriptions } from "shared/NetworkedSignalDescriptions";

// something to stand on
createBaseplate();

const projectileCreatedListener = ClientSignalListener.create(
	ReplicatedStorage.Events,
	NetworkedSignalDescriptions.ProjectileCreated,
);

const projectileCreatedSender = ServerSignalSender.create(
	ReplicatedStorage.Events,
	NetworkedSignalDescriptions.ProjectileCreated,
);

// hot potato!
projectileCreatedListener.connect((player, character, position, velocity, acceleration, color) =>
	projectileCreatedSender.fireToOthers([player], character, position, velocity, acceleration, color),
);

const shootHumanoidSender = ClientSignalListener.create(
	ReplicatedStorage.Events,
	NetworkedSignalDescriptions.ShootHumanoid,
);

shootHumanoidSender.connect((player, humanoid) => {
	const playerCharacter = player.Character;
	if (!playerCharacter || playerCharacter.Parent !== Workspace) return;
	const playerHumanoid = playerCharacter.FindFirstChildWhichIsA("Humanoid");
	if (!playerHumanoid || playerHumanoid.Health <= 0) return;

	humanoid.TakeDamage(100);
});
