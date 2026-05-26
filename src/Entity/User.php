<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity(fields: ['email'], message: 'Diese E-Mail ist bereits vergeben.')]
#[UniqueEntity(fields: ['username'], message: 'Dieser Benutzername ist bereits vergeben.')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank(message: 'Username cannot be empty')]
    #[Assert\Length(min: 3, max: 50)]
    private ?string $username = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank(message: 'Email cannot be empty')]
    #[Assert\Email(message: 'Invalid email address.')]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column(type: 'json')]
    private array $roles = [];

    #[Assert\NotBlank(message: 'Password cannot be empty.', groups: ['registration', 'password'])]
    #[Assert\Length(min: 8, minMessage: 'Password must have at least 8 characters.', groups: ['registration', 'password'])]
    private ?string $plainPassword = null;

    #[ORM\OneToMany(targetEntity: Project::class, mappedBy: 'admin')]
    private Collection $projects;

    #[ORM\OneToMany(targetEntity: Invitation::class, mappedBy: 'invitedBy')]
    private Collection $sentInvitations;

    #[ORM\OneToMany(targetEntity: Invitation::class, mappedBy: 'invitedUser')]
    private Collection $receivedInvitations;

    /**
     * @var Collection<int, TimeEntry>
     */
    #[ORM\OneToMany(targetEntity: TimeEntry::class, mappedBy: 'trackedBy')]
    private Collection $timeEntries;

    public function __construct()
    {
        $this->projects = new ArrayCollection();
        $this->sentInvitations = new ArrayCollection();
        $this->receivedInvitations = new ArrayCollection();
        $this->timeEntries = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }

    public function getUsername(): ?string { return $this->username; }
    public function setUsername(string $username): static { $this->username = $username; return $this; }

    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): static { $this->email = $email; return $this; }

    public function getPassword(): ?string { return $this->password; }
    public function setPassword(string $password): static { $this->password = $password; return $this; }

    public function getPlainPassword(): ?string { return $this->plainPassword; }
    public function setPlainPassword(?string $plainPassword): static { $this->plainPassword = $plainPassword; return $this; }

    public function getRoles(): array { return array_unique(array_merge($this->roles, ['ROLE_USER'])); }
    public function setRoles(array $roles): static { $this->roles = $roles; return $this; }

    public function getUserIdentifier(): string { return (string) $this->username; }
    public function eraseCredentials(): void { $this->plainPassword = null; }

    public function getProjects(): Collection { return $this->projects; }

    public function addProject(Project $project): static
    {
        if (!$this->projects->contains($project)) {
            $this->projects->add($project);
            $project->setAdmin($this);
        }
        return $this;
    }

    public function removeProject(Project $project): static
    {
        if ($this->projects->removeElement($project)) {
            if ($project->getAdmin() === $this) {
                $project->setAdmin(null);
            }
        }
        return $this;
    }

    public function getSentInvitations(): Collection { return $this->sentInvitations; }

    public function addSentInvitation(Invitation $invitation): static
    {
        if (!$this->sentInvitations->contains($invitation)) {
            $this->sentInvitations->add($invitation);
            $invitation->setInvitedBy($this);
        }
        return $this;
    }

    public function removeSentInvitation(Invitation $invitation): static
    {
        if ($this->sentInvitations->removeElement($invitation)) {
            if ($invitation->getInvitedBy() === $this) {
                $invitation->setInvitedBy(null);
            }
        }
        return $this;
    }

    public function getReceivedInvitations(): Collection { return $this->receivedInvitations; }

    public function addReceivedInvitation(Invitation $invitation): static
    {
        if (!$this->receivedInvitations->contains($invitation)) {
            $this->receivedInvitations->add($invitation);
            $invitation->setInvitedUser($this);
        }
        return $this;
    }

    public function removeReceivedInvitation(Invitation $invitation): static
    {
        if ($this->receivedInvitations->removeElement($invitation)) {
            if ($invitation->getInvitedUser() === $this) {
                $invitation->setInvitedUser(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, TimeEntry>
     */
    public function getTimeEntries(): Collection
    {
        return $this->timeEntries;
    }

    public function addTimeEntry(TimeEntry $timeEntry): static
    {
        if (!$this->timeEntries->contains($timeEntry)) {
            $this->timeEntries->add($timeEntry);
            $timeEntry->setTrackedBy($this);
        }

        return $this;
    }

    public function removeTimeEntry(TimeEntry $timeEntry): static
    {
        if ($this->timeEntries->removeElement($timeEntry)) {
            // set the owning side to null (unless already changed)
            if ($timeEntry->getTrackedBy() === $this) {
                $timeEntry->setTrackedBy(null);
            }
        }

        return $this;
    }
}