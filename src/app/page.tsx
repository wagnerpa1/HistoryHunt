"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Map } from "./map";
import { stations } from "./stations";
import { jsPDF } from "jspdf";
import { Icon } from "@iconify/react";

/**
 * Home Component: Main component for the Pfarrkirchen Explorer application.
 * Manages the state and logic for the scavenger hunt, including welcome screen, route overview,
 * navigation, question answering, explanations, and completion screen with certificate download.
 */
export default function Home() {
  // State variables for managing the application flow
  const [currentStation, setCurrentStation] = useState(1); // Current station number
  const [progress, setProgress] = useState(0); // Progress of the scavenger hunt
  const [answer, setAnswer] = useState(""); // User's answer to the current riddle
  const [isCompleted, setIsCompleted] = useState(false); // Completion status of the scavenger hunt
  const [showWelcome, setShowWelcome] = useState(true); // Visibility of the welcome screen
  const [showOverview, setShowOverview] = useState(false); // Visibility of the route overview screen

  // Station stage can be "navigation", "explanation", or "question"
  const [stationStage, setStationStage] = useState<
    "navigation" | "explanation" | "question"
  >("navigation");
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Feedback message for the user
  const [submitted, setSubmitted] = useState(false); // Whether the answer has been submitted

  // Effect to potentially show a welcome screen on initial load (currently disabled)
  useEffect(() => {
    // Simulate loading or any initial setup
    // const timer = setTimeout(() => {
    //   setShowWelcome(false);
    // }, 3000); // Show welcome screen for 3 seconds

    // return () => clearTimeout(timer);
  }, []);

  const totalStations = stations.length; // Total number of stations

  /**
   * Handles the submission of an answer. Checks if the answer is correct and updates the state accordingly.
   */
  const handleAnswerSubmit = () => {
    const currentStationData = stations[currentStation - 1];

    if (!currentStationData) {
      setFeedbackMessage("Stationsdaten nicht gefunden.");
      return;
    }

    setSubmitted(true);

    if (
      answer.toLowerCase() === currentStationData.correctAnswer.toLowerCase()
    ) {
      setStationStage("explanation");
      setSubmitted(false);
      setFeedbackMessage("");
    } else {
      setFeedbackMessage("Falsche Antwort. Bitte versuche es erneut.");
    }
  };

  /**
   * Handles the click event on the start button. Navigates to the route overview screen.
   */
  const handleStartClick = () => {
    setShowWelcome(false);
    setShowOverview(true);
  };

  /**
   * Handles the completion of the route overview screen. Starts the scavenger hunt.
   */
  const handleOverviewComplete = () => {
    setShowOverview(false);
    setProgress(((currentStation - 1) / totalStations) * 100);
  };

  /**
   * Handles the event when the user arrives at a station (navigation screen).
   * Navigates to the question screen.
   */
  const handleNavigationArrived = () => {
    setStationStage("question");
  };

  /**
   * Handles the completion of the explanation screen. Navigates to the next station or completes the hunt.
   */
  const handleExplanationComplete = () => {
    if (currentStation < totalStations) {
      setCurrentStation(currentStation + 1);
      setStationStage("navigation");
      setProgress(((currentStation) / totalStations) * 100);
      setAnswer("");
      setFeedbackMessage("");
    } else {
      setIsCompleted(true);
    }
  };

  /**
   * Handles the download of the completion certificate in PDF format.
   */
  const handleDownloadCertificate = () => {
    const doc = new jsPDF();

    // Add content to the PDF
    doc.text("Zertifikat für den Abschluss des Pfarrkirchen Explorers", 10, 10);
    doc.text("Herzlichen Glückwunsch!", 10, 30);
    doc.text("Sie haben alle Stationen erfolgreich abgeschlossen.", 10, 40);
    doc.text("Ausgestellt am: " + new Date().toLocaleDateString(), 10, 50);

    // Download the PDF
    doc.save("Pfarrkirchen_Explorer_Zertifikat.pdf");
  };

  /**
   * Handles the navigation back to the navigation screen from the question screen.
   */
  const handleBackToNavigation = () => {
    setStationStage("navigation");
    setAnswer("");
    setFeedbackMessage("");
    setSubmitted(false);
  };

  // Render the main application UI
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      {showWelcome ? (
        // Welcome Screen
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Willkommen beim Pfarrkirchen Explorer!
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Mach dich bereit, die verborgenen Schätze von Pfarrkirchen zu
            entdecken.
          </p>
          <Button
            onClick={handleStartClick}
            className="transition-transform hover:scale-105"
          >
            Starten
          </Button>
        </div>
      ) : showOverview ? (
        // Route Overview Screen
        <RouteOverview stations={stations} onComplete={handleOverviewComplete} />
      ) : !isCompleted ? (
        // Main content when the scavenger hunt is in progress
        <div className="transition-all duration-300 ease-out w-full max-w-md">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Pfarrkirchen Explorer
            </h1>
            <p className="text-muted-foreground">
              Entdecke die verborgenen Schätze von Pfarrkirchen!
            </p>
          </header>

          <Progress value={progress} className="w-full max-w-md mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            Station {currentStation} von {totalStations}
          </p>

          <div className="relative h-full">
            {stationStage === "navigation" && (
              // Navigation Screen
              <div className="slide-in-right">
                <NavigationScreen
                  station={stations[currentStation - 1]}
                  onArrived={handleNavigationArrived}
                />
              </div>
            )}
            {stationStage === "explanation" && (
              // Explanation Screen
              <div className="slide-in-right">
                <ExplanationScreen
                  station={stations[currentStation - 1]}
                  onComplete={handleExplanationComplete}
                />
              </div>
            )}
            {stationStage === "question" && (
              // Question Screen
              <div className="slide-in-right">
                <QuestionScreen
                  station={stations[currentStation - 1]}
                  answer={answer}
                  setAnswer={setAnswer}
                  feedbackMessage={feedbackMessage}
                  submitted={submitted}
                  handleAnswerSubmit={handleAnswerSubmit}
                  onBackToNavigation={handleBackToNavigation}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        // Completion Screen
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Herzlichen Glückwunsch!
          </h2>
          <p className="text-muted-foreground mb-6">
            Du hast alle Stationen des Pfarrkirchen Explorers abgeschlossen!
          </p>
          <Button
            onClick={handleDownloadCertificate}
            className="transition-transform hover:scale-105"
          >
            Zertifikat herunterladen
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * RouteOverview Component: Displays an overview of the scavenger hunt route, including a map and a list of stations.
 */
interface RouteOverviewProps {
  stations: { id: number; title: string; riddle: string }[];
  onComplete: () => void;
}

const RouteOverview: React.FC<RouteOverviewProps> = ({
  stations,
  onComplete,
}) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Routenübersicht
      </h2>
      <div className="mb-4 w-full max-w-md map-animation-container">
        <Map stations={stations} currentStation={0} zoom={12} />
      </div>
      <ol className="list-decimal list-inside pl-0 max-w-md w-full">
        {stations.map((station) => (
          <li key={station.id} className="mb-2">
            <strong>{station.title}</strong>
          </li>
        ))}
      </ol>
      <Button
        onClick={onComplete}
        className="transition-transform hover:scale-105"
      >
        Erkundung starten
      </Button>
    </div>
  );
};

/**
 * NavigationScreen Component: Displays a map and navigation information for a specific station.
 */
interface NavigationScreenProps {
  station: {
    id: number;
    title: string;
    mapUrl: string;
    googleMapsLink: string;
    latitude: number;
    longitude: number;
  };
  onArrived: () => void;
}

const NavigationScreen: React.FC<NavigationScreenProps> = ({
  station,
  onArrived,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [currentLocation, setCurrentLocation] = useState<
    { latitude: number; longitude: number } | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      if (!mapRef.current) return;

      const L = require("leaflet");
      require("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current).setView(
        [station.latitude, station.longitude],
        15
      );

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.marker([station.latitude, station.longitude])
        .addTo(map)
        .bindPopup(station.title);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
            L.marker([latitude, longitude], {
              icon: L.icon({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl:
                  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              }),
            })
              .addTo(map)
              .bindPopup("Dein Standort");
            map.setView([latitude, longitude], 15);
          },
          (error) => {
            console.error("Error getting location:", error);
            setError("Standort konnte nicht abgerufen werden.");
          }
        );
      } else {
        setError("Geolocation wird von diesem Browser nicht unterstützt.");
      }

      return () => {
        map.remove();
      };
    };

    if (mapRef.current && !mapRef.current._leaflet_id) {
      loadMap();
    }
  }, [station.latitude, station.longitude, station.title]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Navigation zu {station.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error && <div className="text-red-500">{error}</div>}
        <div
          ref={mapRef}
          style={{ height: "300px", width: "100%" }}
          className="rounded-md"
        />
        <Button asChild className="transition-transform hover:scale-105">
          <a
            href={station.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Route in Google Maps öffnen
          </a>
        </Button>
        <Button
          onClick={onArrived}
          className="transition-transform hover:scale-105"
        >
          Angekommen!
        </Button>
      </CardContent>
    </Card>
  );
};

/**
 * ExplanationScreen Component: Displays an explanation about a specific station.
 */
interface ExplanationScreenProps {
  station: { id: number; title: string; explanation: string; mapUrl: string };
  onComplete: () => void;
}

const ExplanationScreen: React.FC<ExplanationScreenProps> = ({
  station,
  onComplete,
}) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Mehr über {station.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <img
            src={station.mapUrl}
            alt={`Karte von ${station.title}`}
            className="rounded-md"
          />
        </div>
        <p>{station.explanation}</p>
        <Button
          onClick={onComplete}
          className="transition-transform hover:scale-105"
        >
          Weiter
        </Button>
      </CardContent>
    </Card>
  );
};

/**
 * QuestionScreen Component: Displays a riddle or task for the user to solve for a specific station.
 */
interface QuestionScreenProps {
  station: {
    id: number;
    title: string;
    riddle: string;
    correctAnswer: string;
  };
  answer: string;
  setAnswer: (answer: string) => void;
  feedbackMessage: string;
  submitted: boolean;
  handleAnswerSubmit: () => void;
  onBackToNavigation: () => void;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  station,
  answer,
  setAnswer,
  feedbackMessage,
  submitted,
  handleAnswerSubmit,
  onBackToNavigation,
}) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{station.title}</CardTitle>
        <CardDescription>{station.riddle}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {feedbackMessage && (
          <div className="text-center text-red-500 mb-2">
            {feedbackMessage}
          </div>
        )}
        <Input
          type="text"
          placeholder="Deine Antwort"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <Button
          onClick={handleAnswerSubmit}
          className="transition-transform hover:scale-105"
        >
          Antwort absenden
        </Button>
        <Button
          onClick={onBackToNavigation}
          className="transition-transform hover:scale-105"
        >
          Zurück zur Navigation
        </Button>
      </CardContent>
    </Card>
  );
};
