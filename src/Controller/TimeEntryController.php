<?php

namespace App\Controller;

use App\Entity\Project;
use App\Entity\TimeEntry;
use App\Repository\TimeEntryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;

#[Route('/api', name: 'time_entry_')]
class TimeEntryController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private TimeEntryRepository $repo,
    ) {}

    // POST /api/time-entries
    #[Route('/time-entries', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $project = $this->em->getReference(Project::class, $data['projectId']);

        $entry = new TimeEntry();
        $entry->setTrackedBy($this->getUser());
        $entry->setProject($project);
        $entry->setDescription($data['description'] ?? null);
        $entry->setStartTime(new \DateTimeImmutable($data['startTime']));
        $entry->setEndTime(new \DateTimeImmutable($data['endTime']));

        $this->em->persist($entry);
        $this->em->flush();

        return $this->json($this->serialize($entry), 201);
    }

    // GET /api/time-entries
    #[Route('/time-entries', name: 'by_user', methods: ['GET'])]
    public function byUser(): JsonResponse
    {
        $entries = $this->repo->findBy(
            ['trackedBy' => $this->getUser()],
            ['startTime' => 'DESC']
        );

        return $this->json(array_map(
            fn(TimeEntry $e) => $this->serialize($e),
            $entries
        ));
    }

    # GET /api/users/{id}/time-entries
    #[Route('/users/{id}/time-entries', name: 'by_any_user', methods: ['GET'])]
    public function byAnyUser(User $user): JsonResponse
    {
        $entries = $this->repo->findBy(
            ['trackedBy' => $user],
            ['startTime' => 'DESC']
        );

        return $this->json(array_map(
            fn(TimeEntry $e) => $this->serialize($e),
            $entries
        ));
    }

    // GET /api/projects/{id}/time-entries
    #[Route('/projects/{id}/time-entries', name: 'by_project', methods: ['GET'])]
    public function byProject(Project $project): JsonResponse
    {
        if ($project->getAdmin() !== $this->getUser()) {
            return $this->json(['error' => 'Access denied'], 403);
        }

        $entries = $this->repo->findBy(
            ['project' => $project],
            ['startTime' => 'DESC']
        );

        return $this->json(array_map(
            fn(TimeEntry $e) => $this->serialize($e),
            $entries
        ));
    }

    // PUT /api/time-entries/{id}
    #[Route('/time-entries/{id}', name: 'update', methods: ['PUT'])]
    public function update(Request $request, TimeEntry $entry): JsonResponse
    {
        if ($entry->getTrackedBy() !== $this->getUser()) {
            return $this->json(['error' => 'Access denied'], 403);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['description'])) {
            $entry->setDescription($data['description']);
        }
        if (isset($data['startTime'])) {
            $entry->setStartTime(new \DateTimeImmutable($data['startTime']));
        }
        if (isset($data['endTime'])) {
            $entry->setEndTime(new \DateTimeImmutable($data['endTime']));
        }

        $this->em->flush();

        return $this->json($this->serialize($entry));
    }

    // DELETE /api/time-entries/{id}
    #[Route('/time-entries/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(TimeEntry $entry): JsonResponse
    {
        if ($entry->getTrackedBy() !== $this->getUser()) {
            return $this->json(['error' => 'Access denied'], 403);
        }

        $this->em->remove($entry);
        $this->em->flush();

        return $this->json(null, 204);
    }

    private function serialize(TimeEntry $entry): array
    {
        return [
            'id'          => $entry->getId(),
            'description' => $entry->getDescription(),
            'startTime'   => $entry->getStartTime()?->format(\DateTimeInterface::ATOM),
            'endTime'     => $entry->getEndTime()?->format(\DateTimeInterface::ATOM),
            'createdAt'   => $entry->getCreatedAt()?->format(\DateTimeInterface::ATOM),
            'project'     => [
                'id'   => $entry->getProject()?->getId(),
                'name' => $entry->getProject()?->getProjectName(),
            ],
            'trackedBy' => [
                'id'       => $entry->getTrackedBy()?->getId(),
                'username' => $entry->getTrackedBy()?->getUsername(),
            ],
        ];
    }
}
