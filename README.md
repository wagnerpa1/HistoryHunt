# Pfarrkirchen Explorer

This Next.js application is a scavenger hunt that guides users through the town of Pfarrkirchen, Germany.  It presents riddles for different stations, and upon answering them correctly, provides explanations about each location, and allows the user to download a digital certificate upon completion.

## How it Works

The application guides the user through a series of stations in Pfarrkirchen. At each station, the user is presented with a riddle. The user must answer the riddle correctly to proceed to the next station.

### Stages

The application has the following stages:

1.  **Welcome Screen:** The user is greeted with a welcome message and prompted to enter their name. They can also select their preferred language (German or English).
2.  **Route Overview:** The user is presented with an overview of the scavenger hunt route, including a map and a list of stations.
3.  **Navigation Screen:** The user is presented with a map and navigation information for the current station. They can open the route in Google Maps or indicate that they have arrived at the station.
4.  **Question Screen:** The user is presented with a riddle or task to solve for the current station.
5.  **Explanation Screen:** The user is presented with an explanation about the current station.
6.  **Completion Screen:** The user is congratulated on completing the scavenger hunt and given the option to download a digital certificate.

## Getting Started

To get started, clone the repository and run `npm install` followed by `npm run dev`.

```bash
git clone https://github.com/your-username/pfarrkirchen-explorer.git
cd pfarrkirchen-explorer
npm install
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

The project structure is as follows:

*   `.env`: Environment variables.
*   `.vscode/`: VS Code settings.
*   `README.md`: This file.
*   `components.json`: Configuration for Shadcn UI components.
*   `docs/`: Documentation files.
    *   `answers.md`: Answers to the scavenger hunt riddles.
*   `next.config.js`: Next.js configuration.
*   `package.json`: Project dependencies and scripts.
*   `src/`: Source code.
    *   `ai/`: GenAI related code.
        *   `ai-instance.ts`: Genkit AI instance configuration.
        *   `dev.ts`: Development-related code for Genkit.
    *   `app/`: Next.js application code.
        *   `globals.css`: Global CSS styles, including Tailwind CSS configuration.
        *   `i18n/`: Internationalization (i18n) files.
            *   `translations.ts`: Translations for different languages.
        *   `layout.tsx`: Root layout for the Next.js application.
        *   `map.tsx`: Map component using Leaflet.
        *   `page.tsx`: Main component for the Pfarrkirchen Explorer application.
        *   `stations.ts`: Data for the scavenger hunt stations.
    *   `components/`: Reusable React components.
        *   `icons.ts`: Icon definitions using Lucide React.
        *   `ui/`: Shadcn UI components.
            *   (Various UI components such as `accordion.tsx`, `alert.tsx`, `button.tsx`, etc.)
    *   `hooks/`: Custom React hooks.
        *   `use-mobile.tsx`: Hook to detect mobile devices.
        *   `use-toast.ts`: Hook for displaying toast notifications.
    *   `lib/`: Utility functions.
        *   `utils.ts`: Utility functions (e.g., class name merging).
    *   `services/`: External services.
        *   `open-street-maps.ts`: Service for interacting with OpenStreetMap.
    *   `tailwind.config.ts`: Tailwind CSS configuration.
    *   `tsconfig.json`: TypeScript configuration.

## Technologies Used

*   [Next.js](https://nextjs.org/)
*   [React](https://reactjs.org/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Shadcn UI](https://ui.shadcn.com/)
*   [Lucide React](https://lucide.dev/)
*   [Leaflet](https://leafletjs.com/)
*   [JsPDF](https://jspdf.com/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://opensource.org/license/mit/)
