<?php

namespace App\Controller;

use App\Entity\Project;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route("/api/projects", name: "api_projects_")]
#[IsGranted("ROLE_USER")]
final class ProjectController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ProjectRepository $projectRepository
    ) {
    }

    #[Route("", name: "list", methods: ["GET"])]
    public function list(): JsonResponse
    {
        $projects = $this->projectRepository->findBy([
            "admin" => $this->getUser(),
        ]);

        return $this->json(array_map($this->serialize(...), $projects));
    }

    #[Route("", name: "create", methods: ["POST"])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data["name"])) {
            return $this->json(
                ["error" => "Name ist erforderlich."],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $project = new Project();
        $project->setAdmin($this->getUser());
        $project->setProjectName(trim($data["name"]));
        $project->setDescription(
            !empty($data["description"]) ? trim($data["description"]) : null
        );
        $project->setTimeEntriesHaveIdentifier(
            (bool) ($data["useIdentifier"] ?? false)
        );

        $this->em->persist($project);
        $this->em->flush();

        return $this->json($this->serialize($project), Response::HTTP_CREATED);
    }

    #[Route("/{id}", name: "delete", methods: ["DELETE"])]
    public function delete(Project $project): JsonResponse
    {
        if ($project->getAdmin() !== $this->getUser()) {
            return $this->json(
                ["error" => "Zugriff verweigert."],
                Response::HTTP_FORBIDDEN
            );
        }

        $this->em->remove($project);
        $this->em->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route("/{id}/name", name: "update_name", methods: ["PATCH"])]
    public function updateName(Project $project, Request $request): JsonResponse
    {
        if ($project->getAdmin() !== $this->getUser()) {
            return $this->json(
                ["error" => "Zugriff verweigert."],
                Response::HTTP_FORBIDDEN
            );
        }

        $data = json_decode($request->getContent(), true);

        if (empty($data["name"]) || trim($data["name"]) === "") {
            return $this->json(
                ["error" => "Name darf nicht leer sein."],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $project->setProjectName(trim($data["name"]));
        $this->em->flush();

        return $this->json($this->serialize($project));
    }

    #[Route( "/{id}/description", name: "update_description", methods: ["PATCH"])]
    public function updateDescription( Project $project, Request $request): JsonResponse {
        if ($project->getAdmin() !== $this->getUser()) {
            return $this->json(
                ["error" => "Zugriff verweigert."],
                Response::HTTP_FORBIDDEN
            );
        }

        $data = json_decode($request->getContent(), true);

        $project->setDescription(
            isset($data["description"]) ? trim($data["description"]) : null
        );
        $this->em->flush();

        return $this->json($this->serialize($project));
    }

    private function serialize(Project $p): array
    {
        return [
            "id" => $p->getId(),
            "projectName" => $p->getProjectName(),
            "description" => $p->getDescription(),
            "timeEntriesHaveIdentifier" => $p->isTimeEntriesHaveIdentifier(),
        ];
    }
}