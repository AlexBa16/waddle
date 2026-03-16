<?php

namespace App\Entity;

use App\Repository\UserRepository;
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

    // Wird NICHT gespeichert – nur für Validierung beim Registrieren
    #[Assert\NotBlank(message: 'Password cannot be empty.')]
    #[Assert\Length(min: 8, message: 'Password must have at least 8 characters.')]
    private ?string $plainPassword = null;

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

    // UserInterface
    public function getUserIdentifier(): string { return (string) $this->username; }
    public function eraseCredentials(): void { $this->plainPassword = null; }
}