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
        private ValidatorInterface $validator,
    ) {}

    #[Route('/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON.'], Response::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setUsername($data['username'] ?? '');
        $user->setEmail($data['email'] ?? '');
        $user->setPlainPassword($data['password'] ?? '');

        // Validierung
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorList = [];
            foreach ($errors as $error) {
                $errorList[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $errorList], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Passwort hashen
        $user->setPassword(
            $this->passwordHasher->hashPassword($user, $user->getPlainPassword())
        );
        $user->eraseCredentials();

        $this->em->persist($user);
        $this->em->flush();

        return $this->json([
            'message' => 'Registration successful.',
            'user' => [
                'id'       => $user->getId(),
                'username' => $user->getUsername(),
                'email'    => $user->getEmail(),
            ]
        ], Response::HTTP_CREATED);
    }

    // #[Route('/login', methods: ['POST'])]
    // public function login(Request $request): JsonResponse
    // {
    //     $data = json_decode($request->getContent(), true);

    //     $user = $this->em->getRepository(User::class)
    //         ->findOneBy(['username' => $data['username']]);

    //     if (!$user) {
    //         return $this->json(['error' => 'User not found'], 401);
    //     }

    //     if (!$this->passwordHasher->isPasswordValid($user, $data['password'])) {
    //         return $this->json(['error' => 'Wrong password'], 401);
    //     }

    //     return $this->json([
    //         'message' => 'Login erfolgreich'
    //     ]);
    // }
}
