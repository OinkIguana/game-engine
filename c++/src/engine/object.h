#ifndef __GAME_OBJECT_H__
#define __GAME_OBJECT_H__

#include "struct.h"
#include "event.h"

namespace Game {
    class Engine;
    class GameUtility;
    class Object {
        Engine * _eng = nullptr;
    protected:
        Object();
    public:
        static bool persistent;
        void attach(Engine * eng);

        virtual ~Object() = 0;

        // potential events to trigger (in step-chronological order)
        // called after being spawned
        virtual void init();
        // occurs only once per game
        virtual void gamestart();
        // occurs only once per room
        virtual void roomload(int prev, int next);
        virtual void roomstart(int prev, int next);
        // occurs before inputs are processed
        virtual void stepstart();
        // process each input (arbitrary order here)
        virtual void mousemove(const Position & where);
        virtual void keydown(const int which);
        virtual void mousedown(const int which);
        virtual void keyup(const int which);
        virtual void mouseup(const int which);
        // occurs after inputs are processed
        virtual void step();
        // occurs after all objects have moved once
        virtual void stepend();
        // occurs only once per room
        virtual void roomend(int prev, int next);
        // occurs only once per game
        virtual void gameend();
        // general handle to process an event
        void proc(const Event & event);

        GameUtility & game();
    };
}

#endif
