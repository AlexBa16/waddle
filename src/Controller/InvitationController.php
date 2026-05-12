<?php

namespace App\Controller;

use App\Entity\Invitation;
use App\Entity\User;
use App\Repository\InvitationRepository;
use App\Repository\UserRepository;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route("/api", name: "api_")]
#[IsGranted("ROLE_USER")]
final class InvitationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserRepository $userRepository,
        private ProjectRepository $projectRepository,
        private InvitationRepository $invitationRepository,
    ) {}

    #[Route("/users/search", name: "users_search", methods: ["GET"])]
    public function searchUsers(Request $request): JsonResponse
    {
        $query = trim($request->query->get('q', ''));

        if (strlen($query) < 2) {
            return $this->json([]);
        }

        $users = $this->userRepository->searchByUsername($query, $this->getUser());

        return $this->json(array_map(fn(User $u) => [
            'id' => $u->getId(),
            'username' => $u->getUsername(),
        ], $users));
    }

    #[Route("/projects/{id}/invite", name: "project_invite", methods: ["POST"])]
    public function invite(int $id, Request $request): JsonResponse
    {
        $project = $this->projectRepository->find($id);

        if (!$project || $project->getAdmin() !== $this->getUser()) {
            return $this->json(['error' => 'Zugriff verweigert.'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);
        $invitedUser = $this->userRepository->find($data['userId'] ?? 0);

        if (!$invitedUser) {
            return $this->json(['error' => 'User nicht gefunden.'], Response::HTTP_NOT_FOUND);
        }

        $existing = $this->invitationRepository->findOneBy([
            'project' => $project,
            'invitedUser' => $invitedUser,
            'status' => Invitation::STATUS_PENDING,
        ]);

        if ($existing) {
            return $this->json(['error' => 'Bereits eingeladen.'], Response::HTTP_CONFLICT);
        }

        $invitation = new Invitation();
        $invitation->setProject($project);
        $invitation->setInvitedBy($this->getUser());
        $invitation->setInvitedUser($invitedUser);

        $this->em->persist($invitation);
        $this->em->flush();

        return $this->json(['message' => 'Einladung gesendet.'], Response::HTTP_CREATED);
    }

    #[Route("/invitations", name: "invitations_list", methods: ["GET"])]
    public function myInvitations(): JsonResponse
    {
        $invitations = $this->invitationRepository->findBy([
            'invitedUser' => $this->getUser(),
            'status' => Invitation::STATUS_PENDING,
        ]);

        return $this->json(array_map(fn(Invitation $i) => [
            'id' => $i->getId(),
            'project' => [
                'id' => $i->getProject()->getId(),
                'name' => $i->getProject()->getProjectName(),
            ],
            'invitedBy' => $i->getInvitedBy()->getUsername(),
            'createdAt' => $i->getCreatedAt()->format('c'),
        ], $invitations));
    }

    #[Route("/invitations/{id}/respond", name: "invitation_respond", methods: ["PATCH"])]
    public function respond(int $id, Request $request): JsonResponse
    {
        $invitation = $this->invitationRepository->find($id);

        if (!$invitation || $invitation->getInvitedUser() !== $this->getUser()) {
            return $this->json(['error' => 'Nicht gefunden.'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $action = $data['action'] ?? '';

        if (!in_array($action, ['accept', 'decline'])) {
            return $this->json(['error' => 'Ungültige Aktion.'], Response::HTTP_BAD_REQUEST);
        }

        $invitation->setStatus(
            $action === 'accept' ? Invitation::STATUS_ACCEPTED : Invitation::STATUS_DECLINED
        );
        $this->em->flush();

        return $this->json(['status' => $invitation->getStatus()]);
    }
}