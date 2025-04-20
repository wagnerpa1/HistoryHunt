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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { translations } from "./i18n/translations";

/**
 * Home Component: Main component for the Pfarrkirchen Explorer application.
 * Manages the state and logic for the scavenger hunt, including welcome screen, route overview,
 * navigation, question answering, explanations, and completion screen with certificate download.
 */
export default function Home() {
  // State variables for managing the application flow
  const [currentStation, setCurrentStation] = useState(1); // Current station number
  const [progress, setProgress] = useState(0); // Progress of the scavenger hunt
  const [answer, setAnswer] = useState<string | null>(null); // User's answer to the current riddle
  const [isCompleted, setIsCompleted] = useState(false); // Completion status of the scavenger hunt
  const [showWelcome, setShowWelcome] = useState(true); // Visibility of the welcome screen
  const [showOverview, setShowOverview] = useState(false); // Visibility of the route overview screen

  // Station stage can be "navigation", "explanation", or "question"
  const [stationStage, setStationStage] =
    useState<"navigation" | "explanation" | "question">("navigation");
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Feedback message for the user
  const [submitted, setSubmitted] = useState(false); // Whether the answer has been submitted
  const [language, setLanguage] = useState("de"); // Current language state
  const t = translations[language];

  const totalStations = stations.length; // Total number of stations

  /**
   * Handles the submission of an answer. Checks if the answer is correct and updates the state accordingly.
   */
  const handleAnswerSubmit = () => {
    const currentStationData = stations[currentStation - 1];

    if (!currentStationData) {
      setFeedbackMessage(t.stationsdatenNichtGefunden);
      return;
    }

    setSubmitted(true);

    if (
      currentStationData.options[currentStationData.correctAnswerIndex] ===
      answer
    ) {
      setStationStage("explanation");
      setSubmitted(false);
      setFeedbackMessage("");
    } else {
      setFeedbackMessage(t.falscheAntwort);
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
    doc.text(
      translations[language].zertifikatHerunterladen,
      10,
      10
    );
    doc.text(translations[language].herzlichenGluckwunsch, 10, 30);
    doc.text(translations[language].duHastAlleStationen, 10, 40);
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
            {t.welcomeTitle}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            {t.welcomeDescription}
          </p>
          <div className="flex justify-center space-x-4 mb-4">
            <Select onValueChange={setLanguage} defaultValue={language}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleStartClick}
            className="transition-transform hover:scale-105"
          >
            {t.start}
          </Button>
        </div>
      ) : showOverview ? (
        // Route Overview Screen
        <RouteOverview
          stations={stations}
          onComplete={handleOverviewComplete}
          language={language}
        />
      ) : !isCompleted ? (
        // Main content when the scavenger hunt is in progress
        <div className="transition-all duration-300 ease-out w-full max-w-md">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {t.pfarrkirchenExplorer}
            </h1>
            <p className="text-muted-foreground">{t.entdeckeDieSchatze}</p>
          </header>

          <Progress value={progress} className="w-full max-w-md mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            {t.station} {currentStation} {t.von} {totalStations}
          </p>

          <div className="relative h-full">
            {stationStage === "navigation" && (
              // Navigation Screen
              <div className="slide-in-right">
                <NavigationScreen
                  station={stations[currentStation - 1]}
                  onArrived={handleNavigationArrived}
                  language={language}
                />
              </div>
            )}
            {stationStage === "explanation" && (
              // Explanation Screen
              <div className="slide-in-right">
                <ExplanationScreen
                  station={stations[currentStation - 1]}
                  onComplete={handleExplanationComplete}
                  language={language}
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
                  language={language}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        // Completion Screen
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {t.herzlichenGluckwunsch}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t.duHastAlleStationen}
          </p>
          <Button
            onClick={handleDownloadCertificate}
            className="transition-transform hover:scale-105"
          >
            {t.zertifikatHerunterladen}
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
  stations: {
    id: number;
    title: string;
    riddle: string;
    latitude: number;
    longitude: number;
  }[];
  onComplete: () => void;
  language: string;
}

const RouteOverview: React.FC<RouteOverviewProps> = ({
  stations,
  onComplete,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        {t.routeOverview}
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
        {t.start}
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
  language: string;
}

const NavigationScreen: React.FC<NavigationScreenProps> = ({
  station,
  station: { latitude, longitude, title, googleMapsLink },
  onArrived,
  language,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [currentLocation, setCurrentLocation] = useState<
    { latitude: number; longitude: number } | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const t = translations[language];

  useEffect(() => {
    const loadMap = async () => {
      if (!mapRef.current) return;

      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      // Check if the map container already has a Leaflet map instance
      if (mapRef.current.leafletElement) {
        // If so, just set the view to the station's coordinates
        mapRef.current.leafletElement.setView([latitude, longitude], 15);
      } else {
        // Otherwise, create a new map instance
        const map = L.map(mapRef.current).setView([latitude, longitude], 15);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup(title);

        // Store the map instance in the ref
        mapRef.current.leafletElement = map;
      }

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
              .addTo(mapRef.current.leafletElement)
              .bindPopup("Dein Standort");
            mapRef.current.leafletElement.setView([latitude, longitude], 15);
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
        // map.remove();
      };
    };

    if (mapRef.current && !mapRef.current._leaflet_id) {
      loadMap();
    }
  }, [latitude, longitude, title]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t.navigationTo} {title}</CardTitle>
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
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.routeInGoogleMaps}
          </a>
        </Button>
        <Button
          onClick={onArrived}
          className="transition-transform hover:scale-105"
        >
          {t.angekommen}
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
  language: string;
}

const ExplanationScreen: React.FC<ExplanationScreenProps> = ({
  station,
  station: { title, mapUrl, explanation },
  onComplete,
  language,
}) => {
  const t = translations[language];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t.mehrUber} {title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <img
            src={mapUrl}
            alt={`Karte von ${title}`}
            className="rounded-md"
          />
        </div>
        <p>{explanation}</p>
        <Button
          onClick={onComplete}
          className="transition-transform hover:scale-105"
        >
          {t.weiter}
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
    options: string[];
    correctAnswerIndex: number;
  };
  answer: string | null;
  setAnswer: (answer: string | null) => void;
  feedbackMessage: string;
  submitted: boolean;
  handleAnswerSubmit: () => void;
  onBackToNavigation: () => void;
  language: string;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  station,
  station: { title, riddle, options, correctAnswerIndex },
  answer,
  setAnswer,
  feedbackMessage,
  submitted,
  handleAnswerSubmit,
  onBackToNavigation,
  language,
}) => {
  const t = translations[language];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{riddle}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {feedbackMessage && (
          <div className="text-center text-red-500 mb-2">
            {feedbackMessage}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`
                w-full
                text-black
                border-black
                rounded-md
                transition-colors
                hover:bg-green-500
                hover:text-white
                ${answer === option ? "bg-green-500 text-white" : ""}
              `}
              onClick={() => setAnswer(option)}
            >
              {option}
            </Button>
          ))}
        </div>
        <Button
          onClick={handleAnswerSubmit}
          className="transition-transform hover:scale-105"
        >
          {t.antwortAbsenden}
        </Button>
        <Button
          onClick={onBackToNavigation}
          className="transition-transform hover:scale-105"
        >
          {t.zuruckZurNavigation}
        </Button>
      </CardContent>
    </Card>
  );
};
