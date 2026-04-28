<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator
    ) {
    }

    #[Route("/register", name: "app_register", methods: ["POST"])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(
                ["error" => "Invalid JSON."],
                Response::HTTP_BAD_REQUEST
            );
        }

        $user = new User();
        $user->setUsername($data["username"] ?? "");
        $user->setEmail($data["email"] ?? "");
        $user->setPlainPassword($data["password"] ?? "");

        // Validierung
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorList = [];
            foreach ($errors as $error) {
                $errorList[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(
                ["errors" => $errorList],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        // Passwort hashen
        $user->setPassword(
            $this->passwordHasher->hashPassword(
                $user,
                $user->getPlainPassword()
            )
        );
        $user->eraseCredentials();

        $this->em->persist($user);
        $this->em->flush();

        return $this->json(
            [
                "message" => "Registration successful.",
                "user" => [
                    "id" => $user->getId(),
                    "username" => $user->getUsername(),
                    "email" => $user->getEmail(),
                ],
            ],
            Response::HTTP_CREATED
        );
    }
    #[Route("/api/user/username", name: "api_user_update_username", methods: ["PATCH"])]
    #[IsGranted("ROLE_USER")]
    public function updateUsername(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data["username"]) || trim($data["username"]) === "") {
            return $this->json(
                ["error" => "Benutzername darf nicht leer sein."],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        /** @var User $user */
        $user = $this->getUser();
        $user->setUsername(trim($data["username"]));

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorList = [];
            foreach ($errors as $error) {
                $errorList[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(
                ["errors" => $errorList],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $this->em->flush();

        return $this->json([
            "id" => $user->getId(),
            "username" => $user->getUsername(),
            "email" => $user->getEmail(),
        ]);
    }

    #[Route("/api/user/password", name: "api_user_update_password", methods: ["PATCH"])]
    #[IsGranted("ROLE_USER")]
    public function updatePassword(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data["password"]) || empty($data["passwordConfirm"])) {
            return $this->json(
                ["error" => "Passwort und Bestätigung sind erforderlich."],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        if ($data["password"] !== $data["passwordConfirm"]) {
            return $this->json(
                ["error" => "Passwörter stimmen nicht überein."],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        /** @var User $user */
        $user = $this->getUser();
        $user->setPlainPassword($data["password"]);

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorList = [];
            foreach ($errors as $error) {
                $errorList[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(
                ["errors" => $errorList],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $user->setPassword(
            $this->passwordHasher->hashPassword(
                $user,
                $user->getPlainPassword()
            )
        );
        $user->eraseCredentials();

        $this->em->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}